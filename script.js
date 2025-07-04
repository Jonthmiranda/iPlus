//IMPORT THE FUNCTION OF DATABASE JS
import { insertTask, checkTask, getAllTasks } from './db.js';

//IMPORT THE ELEMENTS OF THE HTML
const cad_task_button = document.getElementById('cad_task_button'); //BUTTON TO OPEN THE MODAL TO ADD NEW TASKS
const cancel_task_button_container = document.getElementById('cancel_task_button_container'); //BUTTON TO CLOSE THE MODAL, CANCEL ADD NEW TASKS
const modal_cad_task_container = document.querySelector('.modal_cad_task_container'); //THE MODAL TO ADD NEW TASKS
const title_task = document.getElementById('title_task'); //FIELD TITLE OF THE TASKS
const descrition_task = document.getElementById('descrition_task'); //FIELD DESCRIPTION OF THE TASKS
const cad_task_button_container = document.getElementById('cad_task_button_container'); //BUTTON IN THE MODAL TO ADD THE TASKS
const task_table_tbody = document.querySelector('.task_table tbody'); //TABLE THAT THE TASKS ADDED STAY
const is_empty_container = document.querySelector('.is_empty_container'); //MODAL THAT VERIFY IF HAVE ANY FIELD OF TASK EMPTY
const fill_field_button = document.getElementById('fill_field_button'); //BUTTON OK IN THE VERIFY MODAL
const calendar_button = document.getElementById('calendar_button');
const tasks_button = document.getElementById('tasks_button');
const list_button = document.getElementById('list_button');
const contability_button = document.getElementById('contability_button');
const task_page = document.getElementById('task_page');
const calendar_page = document.getElementById('calendar_page');
const annotation_page = document.getElementById('annotation_page');
const contability_page = document.getElementById('contability_page');

//MUDANÇAS DE TELAS
calendar_button.addEventListener('click', () => {
    calendar_page.style.display = 'flex';
    annotation_page.style.display = 'none';
    contability_page.style.display = 'none';
    task_page.style.display = 'none';
    calendar_button.style.backgroundColor = '#DFDBCE';
    tasks_button.style.backgroundColor = '#EFEBDE';
    list_button.style.backgroundColor = '#EFEBDE';
    contability_button.style.backgroundColor = '#EFEBDE';
});

tasks_button.addEventListener('click', () => {
    calendar_page.style.display = 'none';
    annotation_page.style.display = 'none';
    contability_page.style.display = 'none';
    task_page.style.display = 'flex';
    calendar_button.style.backgroundColor = '#EFEBDE';
    tasks_button.style.backgroundColor = '#DFDBCE';
    list_button.style.backgroundColor = '#EFEBDE';
    contability_button.style.backgroundColor = '#EFEBDE';
});

list_button.addEventListener('click', () => {
    calendar_page.style.display = 'none';
    annotation_page.style.display = 'flex';
    contability_page.style.display = 'none';
    task_page.style.display = 'none';
    calendar_button.style.backgroundColor = '#EFEBDE';
    tasks_button.style.backgroundColor = '#EFEBDE';
    list_button.style.backgroundColor = '#DFDBCE';
    contability_button.style.backgroundColor = '#EFEBDE';
});

contability_button.addEventListener('click', () => {
    calendar_page.style.display = 'none';
    annotation_page.style.display = 'none';
    contability_page.style.display = 'flex';
    task_page.style.display = 'none';
    calendar_button.style.backgroundColor = '#EFEBDE';
    tasks_button.style.backgroundColor = '#EFEBDE';
    list_button.style.backgroundColor = '#EFEBDE';
    contability_button.style.backgroundColor = '#DFDBCE';
});


//THE TASKS SAVE THE HOUR AND DATE THAT YOU ADD, SO, THIS FUNCTION GET THE HOUR AND DATE AND FORMAT TO PT-BR
function formatDateTime() {
    const now = new Date(); //TAKE THE DATETIME
    const date = now.toLocaleDateString('pt-BR'); //FORMAT THE DATE
    const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); //FORMAT THE TIME
    return { date, time };
}

//THIS FUNCTION ONLY CLOSE THE MODAL .MODAL_CAD_TASK_CONTAINER, SO, SET DISPLAY TO NONE AND REMOVE THE WRITING OF THE TITLE AND DESCRIPTION
function close_modal() {
    modal_cad_task_container.style.display = 'none'; 
    title_task.value = '';
    descrition_task.value = '';
}

//CLICK EVENT IN THE BUTTON TO OPEN THE MODAL TO ADD NEW TASKS, SET THE DISPLAY IN STYLE.CSS TO FLEX, SO, HE APPEAR
cad_task_button.addEventListener('click', () => {
    modal_cad_task_container.style.display = 'flex';
});

//CLICK EVENT IN THE BUTTON TO CANCEL ADD NEW TASK, CALL THE CLOSE_MODAL FUNCTION
cancel_task_button_container.addEventListener('click', () => {
    close_modal();
});

//CLICK EVENT IN THE BUTTON OF OK, IN THE VERIFICATION MODAL, ONLY SET IN THE STYLE.CSS DISPLAY: NONE, SO HE IS CLOSED
fill_field_button.addEventListener('click', () => {
    is_empty_container.style.display = 'none';
});

//CLICK EVENT IN THE BUTTON OF ADD TASKS IN THE MODAL, TAKE THE DATETIME FORMATED, TITLE FIELD AND DESCRIPTION FIELD, VERIFY IF HAVE ANY EMPTY
//IF IS, OPEN THE MODAL VERIFY, SET IN STYLE.CSS DISPLAY: FLEX, IF NOT, CALL THE INSERTTASK IN DB.JS, ADD IN THE INDEXEDDB OF THE NAVEGATOR
//RENDER THE TABLE WITH THE TASK, AND CLOSE THE MODAL
cad_task_button_container.addEventListener('click', async () => {
    const { date, time } = formatDateTime(); //CALL THE DATE AND THE TIME FORMATED
    const title = title_task.value.trim(); //THE TITLE WITHOUT SPACE IN THE START AND THE END
    const description = descrition_task.value.trim(); //THE SAME THING THAT TITLE 

    if (title === "" || description === "") { //IF ANY EMPTY
        is_empty_container.style.display = 'flex'; //SHOW THE MODAL OF VERIFICATION
    } else {
        await insertTask(title, description, date, time); //AWAIT THE INSERTTASK END IN THE DB.JS
        await renderTable(); //AWAIT THE END OF RENDERTABLE
        close_modal(); //END OF FUNCTION
    }
});

//RENDER THE TASKS IN THE BODY, GET THE TASKS OF THE GETPENDINGTAKS FROM THE INDEXEDBD, CLEAN THE BODY, ADD NEW LINE <TR> IN THE BODY WITH A CHECKBOX
// THE TITLE, DESCRIPTION, DATE AND TIME 
async function renderTable() {
    const tasks = await getAllTasks(); //CALL ALL TASKS FROM THIS FUNCTION
    const pending = tasks.filter(task => !task.checked); //TASKS NOT CHECKED
    const done = tasks.filter(task => task.checked); //TASKS CHECKED
    const ordered = [...pending, ...done];
    task_table_tbody.innerHTML = ''; //CLEAN THE BODY FIRST

    calendar_button.style.backgroundColor = '#DFDBCE';
    calendar_page.style.display = 'flex';

    ordered.forEach(task => {
        const row = document.createElement('tr'); //CREATE NEW <TR> EM HTML AND ADD THE TASKS
        row.classList.add('task-row');

        row.innerHTML = `
            <td class="task-checkbox"><input type="checkbox" data-id="${task.id}" ${task.checked ? 'checked' : ''}></td>
            <td class="task-cell" colspan="4">
                <div class="task-compact"><strong>${task.title}</strong></div>
                <div class="task-details" style="display: none;">
                    <p>${task.description}</p>
                    <small>
                        Criado: ${task.date} - ${task.time} ${task.checked && task.completedAt ? 
                        `<br> Concluído: ${task.completedAt.date} - ${task.completedAt.time}` : ''}
                    </small>
                </div>
            </td>
            `;
        task_table_tbody.appendChild(row); //APPEND THE LINE IN THE TABLE
});

task_table_tbody.querySelectorAll('.task-cell').forEach(cell => {
    cell.addEventListener('click', () => {
        const row = cell.closest('.task-row');
        const details = cell.querySelector('.task-details');
        const isExpanded = details.style.display === 'block';

        details.style.display = isExpanded ? 'none' : 'block';
        row.classList.toggle('expanded', !isExpanded);
    });
});

//CLICK EVENT IN THE CHECKBOX OF THE TASKS, NEED IMPROVEMENTS, NOW, BASICALY WAIT YOU CHECK A BOX
//AND IF THE CHECKBOX IS CHECKED, RENDER THE TASK GO TO END OF TABLE
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', async function () {
            const id = this.dataset.id;
            await checkTask(id);
            await renderTable();
        });
    });
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
        .then(reg => console.log('Service Worker registrado!', reg))
        .catch(err => console.error('Erro no Service Worker', err));
    });
}

renderTable(); //CALL THE FUNCTION TO CHARGE THE TASKS WHEN OPEN THE SYSTEM
