import { Page } from '@playwright/test';

export type MokeMode =
    | "auth"
    | "menu"
    | 'order'
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
        const meRes = { "id": 1, "name": "j", "email": "j@test", "roles": [{ "role": "diner" }], "iat": 12345 }

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

async function mockOrder(page: Page) {
    await page.route('*/**/api/order', async (route) => {
        const orderRes = {
            "order": {
                "items": [
                    {
                        "menuId": 1,
                        "description": "Veggie",
                        "price": 0.0038
                    }
                ],
                "storeId": "19",
                "franchiseId": 19,
                "id": 1561
            },
            "jwt": "eyJpYXQiOjE3NzAxNzY3MjUsImV4cCI6MTc3MDI2MzEyNSwiaXNzIjoiY3MzMjkuY2xpY2siLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9TcF94VzhlM3kwNk1KS3ZIeW9sRFZMaXZXX2hnTWxhcFZSUVFQVndiY0UifQ.eyJ2ZW5kb3IiOnsiaWQiOiJieXVjc3N0dWRlbnQiLCJuYW1lIjoiQllVIFN0dWRlbnQifSwiZGluZXIiOnsiaWQiOjQwOCwibmFtZSI6ImoiLCJlbWFpbCI6ImpAaiJ9LCJvcmRlciI6eyJpdGVtcyI6W3sibWVudUlkIjoxLCJkZXNjcmlwdGlvbiI6IlZlZ2dpZSIsInByaWNlIjowLjAwMzh9XSwic3RvcmVJZCI6IjE5IiwiZnJhbmNoaXNlSWQiOjE5LCJpZCI6MTU2MX19.dwvafQ_8zXXWEhq7AJvuwBxak9r5lln2JxjLQMXU5-yDVSdfJFsyGxQWzZid6xIFa1wr0Jruh1DCaDRWQ8OIDiNbNHXQ-BL857VcS8kPTnE73Xyk-X25twC_0k8Sdjp6uNSweTui01VPnkGYTt6UNv3Ue_MSv9rOKHrpfDeyxcY9ggqfCRBeIExjZyj1KHoEzJmXwXdgbmswcfDNrAYVOKB9SUzpYogUGCA_6QiTWoUpoX91qjecF701zR683BbSni1lWhk4vl2Yq2dZCMgQxf2ulwVDoMQxO3ErG9G-Ati4xMU5xNhHxQhjdpHStJqWt5HZ4kfTQhyokMiYPmhUTDRItLsBBVFmni31eAbDkI_mUhyWlDFds3fqh6oTzUr1f8jkpKqMyiYmN18UyReD0sUrzNZsYOYrX6eb8i_xMJmefHecHnVoRK8l84Why3Bd_ka0OOxZ0_L_7uwp89Z0MQrHOC4-Pu_QhGKIeQLyxFnt_LchUXkNrrU2O0Y3ugDVeyLom0wOQa08xM_sDf5f8VK-_oowVEWiIweQkK5gBiCycVxGV_pu83dSCMFCsKjMCRotM4tRo4vEOYlolDCpBES25FVCK_lEmh8xHZXoVuiM0Y2_etQmpHxIfhrXRZ05xU1W1phKf5BNY8GKVUCA1E-4OCDaQgzC6DbL_3svb3c"
        }

        await route.fulfill({ json: orderRes });
    });
}

export async function mockAPI(page: Page, ...modes: MokeMode[]) {
    for (const mode of modes) {
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
            case 'order': {
                await mockOrder(page);
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