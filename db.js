// db.js
const DB_NAME = "iPlusDB"; //NAME OF THE BD
const DB_VERSION = 1; //VERSION OF THE BD
const STORE_NAME = "tasks"; //NAME OF THE TABLE

//FUNCTION THAT OPEN A CONECTION WITH INDEXEDDB, IF HE NOT EXIST OR VERSION IS DIFFERENT, IS CREATED A NEW BANK
//AFTER THE REQUEST WILL START WHEN THE BANK IS CREATED OR THE VERSION IS UPDATED
//CREATE THE TABLE TASKS WITH YOUR ID PRIMARY KEY AUTO INCREMENTED,
//SO IS CREATE A INDEX THAT FIND TASKS IS CHECKED OR NOT
//TWO MSG, SUCCESS OR ERROR
function openDB() {
    return new Promise((resolve, reject) => { //IT'S WILL WORK TO WAIT THE FUNCTION END
        const request = indexedDB.open(DB_NAME, DB_VERSION); //OPEN THE INDEXEDDB

        request.onupgradeneeded = function (e) { //ONLY WHEN THE BD IS CREATED OR THE VERSION IS UPDATED
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) { //CREATE THE TABLE TASKS
                const store = db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
                store.createIndex("checked", "checked", { unique: false });
            }
        };

        request.onsuccess = () => resolve(request.result); //MSG OF SUCCESS
        request.onerror = () => reject(request.error); //MSG OF ERROR
    });
}

//INSERT IN TABLE TASKS, THE DATA OF THE TASKS ADD
export async function insertTask(title, description, date, time) {
    const db = await openDB(); //WAIT THE BD OPEN
    const tx = db.transaction(STORE_NAME, "readwrite"); 
    const store = tx.objectStore(STORE_NAME);
    await store.add({ title, description, date, time, checked: false }); //CREATE THE TASK WITH THE CHECKED FALSE
    return tx.complete; //END
}

//UPDATE THE CHECKED IF THE CHECKBOX IS MARKED
//GET THE ID OF THE TASKS CHECKED, 
export async function checkTask(id) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
        const req = store.get(Number(id));
        req.onsuccess = () => {
            const task = req.result;

            const now = new Date();
            const date = now.toLocaleDateString('pt-BR');
            const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            task.checked = !task.checked;

            if (task.checked) {
                task.completedAt = { date, time }; // adiciona data de conclusão
            } else {
                delete task.completedAt; // remove se desmarcado
            }

            store.put(task);
            resolve(true);
        };
        req.onerror = () => reject(req.error);
    });
}


//GET ALL ITEMS OF THE BD
export async function getAllTasks() {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const tasks = [];

    return new Promise((resolve, reject) => {
        const req = store.openCursor();
        req.onsuccess = (e) => {
            const cursor = e.target.result;
            if (cursor) {
                tasks.push(cursor.value);
                cursor.continue();
            } else {
                resolve(tasks);
            }
        };
        req.onerror = () => reject(req.error);
    });
}
