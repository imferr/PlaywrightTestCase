import { test, expect } from '@playwright/test';
import { ProjectPage } from '../pages/projects.page';
import { ToDoHomePage } from '../pages/toDoHome.page';
import randomEmail from '../functions/functions';

// Configuración inicial antes de cada test
test.describe('Gestión de Tareas en Work', () => {
    test.beforeEach(async ({ page }) => {
        const toDoHomePage = new ToDoHomePage(page);
        await toDoHomePage.goto();
        await toDoHomePage.crearNuevoUsuario(
            "Fernanda Gutierrez",
            randomEmail()
        );
    });

    // PLAYWRIGHT TEST CASE 2

    // Escenario: Editar y priorizar el penúltimo ítem en Work
    test('Editar el penúltimo ítem en Work y ponerle prioridad', async ({ page }) => {
        const projectPage = new ProjectPage(page);
        await projectPage.editAndPrioritizePenultimateItem();
    });

    // Escenario: Eliminar el segundo ítem en Work\
    test('Eliminar el segundo ítem', async ({ page }) => {
        const projectPage = new ProjectPage(page);
        await projectPage.deleteSecondItem();
    });
});
