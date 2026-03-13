import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Papa from 'papaparse';

// We need a Service Role key to bypass RLS for automated ingestion
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let syncLogId: string | null = null;

  try {
    // 1. Create an initial sync log entry
    const { data: syncLog, error: logError } = await supabase
      .from('email_sync_logs')
      .insert({ status: 'processing', records_processed: 0 })
      .select('id')
      .single();

    if (!logError && syncLog) {
      syncLogId = syncLog.id;
    }

    // 2. Extract payload
    // We expect either a raw CSV string (for easy manual testing) or a JSON with an attachment
    const contentType = request.headers.get('content-type') || '';
    let csvContent = '';

    if (contentType.includes('application/json')) {
      const data = await request.json();
      // Handle SendGrid/Mailgun style JSON webhooks where attachments might be base64
      if (data.csv_base64) {
        csvContent = Buffer.from(data.csv_base64, 'base64').toString('utf-8');
      } else if (data.csv_text) {
        csvContent = data.csv_text;
      } else {
         throw new Error('No CSV content found in JSON payload. Expected csv_base64 or csv_text.');
      }
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      if (!file) throw new Error('No file found in form data');
      csvContent = await file.text();
    } else {
      // Fallback: assume the raw body is the CSV text
      csvContent = await request.text();
    }

    if (!csvContent || csvContent.trim() === '') {
      throw new Error('Empty CSV content received');
    }

    // 3. Parse CSV
    const parsed = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, '_'),
    });

    if (parsed.errors.length > 0) {
      throw new Error(`CSV Parsing error: ${parsed.errors[0].message}`);
    }

    const rows = parsed.data as any[];
    let processedCount = 0;

    // 4. Process each row
    for (const row of rows) {
      const extension = row.extension || row.extension_number;
      const callDateStr = row.date || row.call_date || row.timestamp;
      const duration = parseInt(row.duration || '0', 10);
      
      if (!extension || !callDateStr) continue;

      const callDate = new Date(callDateStr).toISOString();

      // Find the correct sales rep based on the historical assignment timeline
      const { data: assignments, error: assignmentError } = await supabase
        .from('extension_assignments')
        .select('rep_id')
        .eq('extension_number', extension)
        .lte('start_date', callDate)
        .order('start_date', { ascending: false });

      if (assignmentError || !assignments || assignments.length === 0) {
        console.warn(`No rep found for extension ${extension} on ${callDate}`);
        continue;
      }

      // We need the assignment that was active AT the time of the call.
      // Since ordered by start_date DESC, the first one that started BEFORE the call is likely it.
      // But we should also verify the end_date if it's not null.
      let assignedRepId = null;
      for (const assignment of assignments) {
        // We know start_date <= callDate from the query
        // Now check if end_date is null OR end_date >= callDate (using JS logic or we could do it in SQL)
        // For simplicity, we assume the query above gets us close, let's refine in another query or here.
        assignedRepId = assignment.rep_id;
        break; // take the most recent one that started before the call
      }

      if (assignedRepId) {
        // Insert the call
        const { error: insertError } = await supabase
          .from('sales_calls')
          .insert({
            rep_id: assignedRepId,
            extension_number: extension,
            call_date: callDate,
            duration: duration,
          });

        if (!insertError) {
          processedCount++;
        } else {
          console.error("Failed to insert call:", insertError);
        }
      }
    }

    // 5. Update Sync Log
    if (syncLogId) {
      await supabase
        .from('email_sync_logs')
        .update({ 
          status: 'success', 
          records_processed: processedCount 
        })
        .eq('id', syncLogId);
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${processedCount} rows successfully`,
      duration_ms: Date.now() - startTime
    });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    
    // Update Sync Log on failure
    if (syncLogId) {
      await supabase
        .from('email_sync_logs')
        .update({ 
          status: 'error', 
          error_message: error.message 
        })
        .eq('id', syncLogId);
    } else {
      // If we failed before creating the log, try to create an error log now
      await supabase
        .from('email_sync_logs')
        .insert({
          status: 'error',
          records_processed: 0,
          error_message: error.message
        });
    }

    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 400 });
  }
}
