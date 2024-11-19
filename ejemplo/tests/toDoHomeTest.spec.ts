// toDoHome.test.ts
import {test, expect} from '@playwright/test';
import { ToDoHomePage } from '../pages/toDoHome.page';

test.beforeEach(async ({ page }) => {
    await page.goto( 'http://todo.ly/')
});

test ('Registrar nuevo usuario', async ({page}) => {
    const homePage = new ToDoHomePage(page)
    await homePage.clickOnSignUpFree()
    await homePage.llenarDatosNuevoUsuario('Juana de Arco', 'juanadearco1@email.com');
    await homePage.guardarNuevoUsuario();
});