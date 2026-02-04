import { Page } from '@playwright/test';

export type MokeMode = 
    | "auth"
    | "stores"
    | "admin";

async function mockAuth(page: Page){
    await page.route('*/**/api/auth', async (route) => {
    const loginRes = {
        user: {
        id: 3,
        name: 'j',
        email: 'j@test',
        roles: [{ role: 'diner' }],
        },
        token: 'abcdef',
    };

    switch (route.request().method()) {
        case 'POST':
        case 'PUT': {
            await route.fulfill({ json: loginRes });
            break;
        }
        case 'DELETE': {
            await route.fulfill({ json: { message: "logout successful" } });
            break;
        }
    }
    });
}

export async function mockAPI(page: Page, ... modes: MokeMode[]) {
    for(const mode of modes) {
        switch (mode) {
            case 'auth': {
                await mockAuth(page);
                break;
            }
            case 'admin': {
                throw new Error("not implemented")
            }

        }
    }
}
