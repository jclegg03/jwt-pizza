import { Page } from '@playwright/test';

export type MokeMode = 
    | "auth"
    | "menu"
    | "franchises"
    | "stores"
    | "me"
    | "admin";

async function mockAuth(page: Page) {
    await page.route('*/**/api/auth', async (route) => {
    const loginRes = {
        user: {
        id: 1,
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

async function mockMenu(page: Page) {
    await page.route('*/**/api/order/menu', async (route) => {
        const menuRes = [
        {
            "id": 1,
            "title": "Veggie",
            "image": "pizza1.png",
            "price": 0.0038,
            "description": "A garden of delight"
        },
        {
            "id": 2,
            "title": "Pepperoni",
            "image": "pizza2.png",
            "price": 0.0042,
            "description": "Spicy treat"
        }]

        await route.fulfill({ json: menuRes });
    });
}

async function mockMe(page: Page) {
    await page.route('*/**/api/user/me', async (route) => {
        const meRes = {"id":1,"name":"j","email":"j@test","roles":[{"role":"diner"}],"iat":12345}

        await route.fulfill({ json: meRes });
    });
}

async function mockFranchises(page: Page) {
    await page.route('*/**/api/franchise*', async (route) => {
        const franchiseRes = {
            franchises: [
                {
                    id: 1,
                    name: "franchise",
                    stores: [
                        {
                            id: 1,
                            name: "Biggy Smalls Pizza"
                        },
                        {
                            id: 2,
                            name: "store"
                        },
                        {
                            id: 3,
                            name: "orem"
                        }
                    ]
                }
            ],
            "more": false
            }

        await route.fulfill({ json: franchiseRes });
    });
}

export async function mockAPI(page: Page, ... modes: MokeMode[]) {
    for(const mode of modes) {
        switch (mode) {
            case 'auth': {
                await mockAuth(page);
                break;
            }
            case 'menu': {
                await mockMenu(page);
                break;
            }
            case "franchises": {
                await mockFranchises(page);
                break;
            }
            case 'me': {
                await mockMe(page);
                break;
            }
            case 'admin': 
            case 'stores': {
                throw new Error("not implemented")
            }
            
        }
    }
}

export async function login(page: Page) {
  await page.goto('http://localhost:5173/');
  mockAPI(page, "auth");

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('j@test');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('monkeypie');
  await page.getByRole('button', { name: 'Login' }).click();
}