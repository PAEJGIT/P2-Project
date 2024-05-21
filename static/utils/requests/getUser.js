// Get current user data from data/accounts.json

import { readFileSync } from 'fs';
import { join } from 'path';

export default function getUser() {
    const accounts = JSON.parse(readFileSync(join(process.cwd(), 'data/accounts.json'), 'utf-8'));
    return accounts.find((account) => account.id === 1);
    }