import { createClient } from '@supabase/supabase-js';

// Using provided keys
const supabaseUrl = 'https://phmbgpyicjsgcgowwilr.supabase.co';
const supabaseKey = 'sb_publishable_l8mWZSwL-QTIC8eOzGBn6w_3ph24MIr';

export const supabase = createClient(supabaseUrl, supabaseKey);