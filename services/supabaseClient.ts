import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://apzxljmgqfdztrbbnyoe.supabase.co';
const supabaseKey = 'sb_publishable_dozOJ8ShnNXBLpWVltL49Q_njreBxPp';

export const supabase = createClient(supabaseUrl, supabaseKey);