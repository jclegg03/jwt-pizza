import { Page } from '@playwright/test';
import { BrowserContext } from '@playwright/test';

export type MokeMode =
    | "auth"
    | "menu"
    | 'order'
    | "franchises"
    | "stores"
    | "me"
    | 'verify'
    | "admin";

async function mockAuth(context: BrowserContext, role: String) {
    await context.route('**/api/auth', async (route) => {
        const loginRes = {
            user: {
                id: 1,
                name: 'j',
                email: 'j@test',
                roles: [{ role: role }],
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
    }, { times: Infinity });
}

async function mockMenu(context: BrowserContext) {
    await context.route('**/api/order/menu', async (route) => {
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
    }, { times: Infinity });
}

async function mockMe(context: BrowserContext) {
    await context.route('**/api/user/me', async (route) => {
        const meRes = { "id": 1, "name": "j", "email": "j@test", "roles": [{ "role": "diner" }], "iat": 12345 }
        await route.fulfill({ json: meRes });
    }, { times: Infinity });
}

async function mockFranchises(context: BrowserContext) {
    await context.route('**/api/franchise*', async (route) => {
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
    }, { times: Infinity });
}

async function mockOrder(context: BrowserContext) {
    await context.route('**/api/order', async (route) => {
        const orderRes = {
            "order": {
                "items": [
                    {
                        "menuId": 1,
                        "description": "Veggie",
                        "price": 0.0038
                    }
                ],
                "storeId": 1,
                "franchiseId": 1,
                "id": 1
            },
            jwt: "easy.JWT.pizza"
        }

        await route.fulfill({ json: orderRes });
    }, { times: Infinity });
}

async function mockVerify(context: BrowserContext) {
    await context.route('**/api/order/verify', async (route) => {
        const verifyRes = {
    "message": "valid",
    "payload": {
        "vendor": {
            "id": "byucsstudent",
            "name": "BYU Student"
        },
        "diner": {
            "id": 1,
            "name": "j",
            "email": "j@j"
        },
        "order": {
            "items": [
                {
                    "menuId": 1,
                    "description": "Veggie",
                    "price": 0.0038
                }
            ],
            "storeId": 1,
            "franchiseId": 1,
            "id": 1
        }
    }
}

        await route.fulfill({ json: verifyRes });
    }, { times: Infinity });
}

export async function mockAPI(context: BrowserContext, ...modes: MokeMode[]) {
    for (const mode of modes) {
        switch (mode) {
            case 'auth': {
                await mockAuth(context, 'diner');
                break;
            }
            case 'menu': {
                await mockMenu(context);
                break;
            }
            case "franchises": {
                await mockFranchises(context);
                break;
            }
            case 'me': {
                await mockMe(context);
                break;
            }
            case 'order': {
                await mockOrder(context);
                break;
            }
            case 'verify': {
                await mockVerify(context);
                break;
            }
            case 'admin': {
                await mockAuth(context, 'admin');
                break;
            }
            case 'stores': {
                throw new Error("not implemented")
            }

        }
    }
}

export async function login(page: Page) {
    await page.goto('http://localhost:5173/');

    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('j@test');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('monkeypie');
    await page.getByRole('button', { name: 'Login' }).click();
}