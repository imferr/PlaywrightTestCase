import { expect, Locator, Page } from '@playwright/test';

export class ToDoHomePage {
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
        this.penultimateTaskSetPriorityButton = page.locator('#itemContextMenu > li.share.separator > div#Div1 span:nth-child(2)');
        this.secondTask = page.locator('#mainItemList > li:nth-child(2)');
        this.secondTaskOptionsButton = page.locator('#mainItemList > li:nth-child(2) .ItemMenu');
        this.secondTaskDeleteButton = page.locator('#itemContextMenu > li.delete.separator > a');
        this.loader = page.locator('#LoaderImg');
        this.notificationMessage = page.locator('#HeaderMessageInfo');
        this.taskList = page.locator('#MainContentTasks');
    }

    async goto() {
        await this.page.goto(this.url);
    }

    async editAndPrioritizePenultimateItem() {
        await this.penultimateTask.hover();
        await this.penultimateTaskOptionsButton.click();
        await this.penultimateTaskSetPriorityButton.click();
        await this.loader.waitFor({ state: 'hidden' });
        const highPriorityColor = 'rgb(22, 139, 184)';
        await expect(this.penultimateTask.locator('.ItemContentDiv')).toHaveCSS('color', highPriorityColor);
    }

    async deleteSecondItem() {
        const secondTaskId = await this.secondTask.getAttribute('itemid');
        if (!secondTaskId) {
            throw new Error('Second task ID could not be found.');
        }
        await this.secondTask.hover();
        await this.secondTaskOptionsButton.click();
        await this.secondTaskDeleteButton.click();
        await this.notificationMessage.waitFor({ state: 'visible' });
        const deletionMessage = 'Info. Item has been Deleted';
        await expect(this.notificationMessage).toHaveText(deletionMessage);
        await this.loader.waitFor({ state: 'hidden' });
        await expect(this.taskList).not.toContainText(secondTaskId);
    }
}
