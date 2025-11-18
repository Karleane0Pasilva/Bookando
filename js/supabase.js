import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://vhdxcxiscedtrjwjthpt.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoZHhjeGlzY2VkdHJqd2p0aHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4ODkxMzUsImV4cCI6MjA3ODQ2NTEzNX0.7XGsO_0io-1eLHWpcGsrwutSRgsIkbyi9uGXQXYB0NM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)