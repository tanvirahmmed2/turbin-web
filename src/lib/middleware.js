import { NextResponse } from 'next/server';
import { getSession } from './auth';

export async function isLoggedIn(req) {
    try {
        const session = getSession(req);
        if (!session) {
            return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
        }
        return { session };
    } catch (error) {
        return { error: NextResponse.json({ error: 'Internal server error' }, { status: 500 }) };
    }
}

export async function isOwner(req) {
    try {
        const { session, error } = await isLoggedIn(req);
        if (error) return { error };

        if (session.role !== 'owner') {
            return { error: NextResponse.json({ error: 'Forbidden. Owner access required.' }, { status: 403 }) };
        }
        return { session };
    } catch (error) {
        return { error: NextResponse.json({ error: 'Internal server error' }, { status: 500 }) };
    }
}

export async function isManager(req) {
    try {
        const { session, error } = await isLoggedIn(req);
        if (error) return { error };

        if (!['owner', 'manager'].includes(session.role)) {
            return { error: NextResponse.json({ error: 'Forbidden. Manager access required.' }, { status: 403 }) };
        }
        return { session };
    } catch (error) {
        return { error: NextResponse.json({ error: 'Internal server error' }, { status: 500 }) };
    }
}

export async function isStaff(req) {
    try {
        const { session, error } = await isLoggedIn(req);
        if (error) return { error };

        if (!['owner', 'manager', 'staff'].includes(session.role)) {
            return { error: NextResponse.json({ error: 'Forbidden. Staff access required.' }, { status: 403 }) };
        }
        return { session };
    } catch (error) {
        return { error: NextResponse.json({ error: 'Internal server error' }, { status: 500 }) };
    }
}

export async function isGuide(req) {
    try {
        const { session, error } = await isLoggedIn(req);
        if (error) return { error };

        if (!['owner', 'manager', 'guide'].includes(session.role)) {
            return { error: NextResponse.json({ error: 'Forbidden. Guide access required.' }, { status: 403 }) };
        }
        return { session };
    } catch (error) {
        return { error: NextResponse.json({ error: 'Internal server error' }, { status: 500 }) };
    }
}

export async function isSupport(req) {
    try {
        const { session, error } = await isLoggedIn(req);
        if (error) return { error };

        if (!['owner', 'manager', 'support'].includes(session.role)) {
            return { error: NextResponse.json({ error: 'Forbidden. Support access required.' }, { status: 403 }) };
        }
        return { session };
    } catch (error) {
        return { error: NextResponse.json({ error: 'Internal server error' }, { status: 500 }) };
    }
}

export async function isManagement(req) {
    try {
        const { session, error } = await isLoggedIn(req);
        if (error) return { error };

        const managementRoles = ['owner', 'manager', 'staff', 'guide', 'support'];
        if (!managementRoles.includes(session.role)) {
            return { error: NextResponse.json({ error: 'Forbidden. Management access required.' }, { status: 403 }) };
        }
        return { session };
    } catch (error) {
        return { error: NextResponse.json({ error: 'Internal server error' }, { status: 500 }) };
    }
}

export async function isCustomer(req) {
    try {
        const { session, error } = await isLoggedIn(req);
        if (error) return { error };

        if (session.role !== 'customer') {
            return { error: NextResponse.json({ error: 'Forbidden. Customer access required.' }, { status: 403 }) };
        }
        return { session };
    } catch (error) {
        return { error: NextResponse.json({ error: 'Internal server error' }, { status: 500 }) };
    }
}