import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createClient } from '@supabase/supabase-js';

const projectUrl = process.env.SUPABASE_PROJECT_URL
const projectKey = process.env.SUPABASE_PROJECT_KEY

export const supabase = createClient(projectUrl, projectKey, {
    auth: {
        storage: AsyncStorage // allows user to stay logged in even after leaving app
    }
});