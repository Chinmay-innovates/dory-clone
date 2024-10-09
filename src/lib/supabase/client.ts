import {createClient} from "@supabase/supabase-js";

export const supabaseClient = createClient(
    "https://rzrgwhecvbrsrlfzbvic.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6cmd3aGVjdmJyc3JsZnpidmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgwNjU0NzMsImV4cCI6MjA0MzY0MTQ3M30.yvxAJ7qtrYsUd3ptDFqcWTcdqyDI6cpvhFxEnaw4um4"
);
