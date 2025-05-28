// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://folvsieyeswhknngwpvg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvbHZzaWV5ZXN3aGtubmd3cHZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyOTI1MzMsImV4cCI6MjA2MTg2ODUzM30.fgecdQuUNbQfMQYNGc65dJP9yC8UJzNTh1fUTkPuvD4";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
