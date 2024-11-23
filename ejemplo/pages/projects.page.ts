import { expect, Locator, Page } from '@playwright/test';

export class ProjectPage {
    readonly url = "https://todo.ly/";
    readonly page: Page;
    readonly signOutButton: Locator;
    readonly penultimateTask: Locator;
    readonly penultimateTaskOptionsButton: Locator;
    readonly penultimateTaskSetPriorityButton: Locator;
    readonly secondTask: Locator;
    readonly secondTaskOptionsButton: Locator;
    readonly secondTaskDeleteButton: Locator;
    readonly loader: Locator;
    readonly notificationMessage: Locator;
    readonly taskList: Locator;

    constructor(page: Page) {
        this.page = page;
        this.signOutButton = page.locator('.signout');
        this.penultimateTask = page.locator('#mainItemList > li:nth-last-child(2)');
        this.penultimateTaskOptionsButton = page.locator('#mainItemList > li:nth-last-child(2) .ItemMenu');
        this.penultimateTaskSetPriorityButton = page.locator('#itemContextMenu > li.share.separator > div#Div1 span:nth-child(3)');
        this.secondTask = page.locator('#mainItemList > li:nth-child(2)');
        this.secondTaskOptionsButton = page.locator('#mainItemList > li:nth-child(2) .ItemMenu');
        this.secondTaskDeleteButton = page.locator('#itemContextMenu > li.delete.separator > a');
        this.loader = page.locator('#LoaderImg');
        this.notificationMessage = page.locator('#HeaderMessageInfo');
        this.taskList = page.locator('#MainContentTasks');
    }

    async goto() {
        await this.page.goto(this.url);

        // Validar que la página se ha cargado correctamente
        await expect(this.page).toHaveURL(this.url);
        await expect(this.signOutButton).toBeVisible();
    }

    async editAndPrioritizePenultimateItem() {
        // Verificar que la tarea existe antes de interactuar
        await expect(this.penultimateTask).toBeVisible();

        // Abrir las opciones de la penúltima tarea
        await this.penultimateTask.hover();
        await this.penultimateTaskOptionsButton.click();
        await expect(this.penultimateTaskOptionsButton).toBeVisible();

        // Establecer prioridad
        await this.penultimateTaskSetPriorityButton.click();

        // Validar que el cargador aparece y desaparece
        await expect(this.loader).toBeVisible();
        await this.loader.waitFor({ state: 'hidden' });

        // Validar que el color de alta prioridad se aplica correctamente
        const highPriorityColor = 'rgb(81, 153, 45)';
        await expect(this.penultimateTask.locator('.ItemContentDiv')).toHaveCSS('color', highPriorityColor);

        // Confirmar que la tarea sigue visible con la nueva prioridad
        await expect(this.penultimateTask).toBeVisible();
    }

    async deleteSecondItem() {
        // Verificar que la segunda tarea existe
        await expect(this.secondTask).toBeVisible();

        // Obtener el ID de la tarea y validar que no es nulo
        const secondTaskId = await this.secondTask.getAttribute('itemid');
        if (!secondTaskId) {
            throw new Error('Second task ID could not be found.');
        }

        // Abrir las opciones de la segunda tarea
        await this.secondTask.hover();
        await this.secondTaskOptionsButton.click();
        await expect(this.secondTaskOptionsButton).toBeVisible();

        // Eliminar la tarea
        await this.secondTaskDeleteButton.click();

        // Validar que aparece un mensaje de notificación
        await expect(this.notificationMessage).toBeVisible();
        const deletionMessage = 'Info. Item has been Deleted';
        await expect(this.notificationMessage).toHaveText(deletionMessage);

        // Validar que el cargador aparece y desaparece
        await expect(this.loader).toBeVisible();
        await this.loader.waitFor({ state: 'hidden' });

        // Confirmar que la tarea ya no está en la lista
        await expect(this.taskList).not.toContainText(secondTaskId);

        // Confirmar que el mensaje de notificación desaparece
        await this.notificationMessage.waitFor({ state: 'hidden' });
    }
}
