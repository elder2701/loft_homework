import './main.css';
const render = require('./friendsList.hbs');
let leftList = document.querySelector('#leftList');
let rightList = document.querySelector('#rightList');
let btnSave = document.querySelector('#save');
let leftListPersons = [];
let rightListPersons = [];
let leftInput = document.querySelector('#leftInput');
let rightInput = document.querySelector('#rightInput');

function api(method, params) {
    return new Promise((resolve, reject) => {
        VK.api(method, params, data => {
            if (data.error) {
                reject(new Error(data.error.error_msg));
            } else {
                resolve(data.response);
            }
        });
    });
}
const promise = new Promise((resolve, reject) => {
    VK.init({
        apiId: 6198589 
    });

    VK.Auth.login(data => {
        if (data.session) {
            resolve(data);
        } else {
            reject(new Error('Не удалось авторизоваться'));
        }
    }, 16);
}); 

promise
    .then(data => {
        return api('friends.get', { v: 5.68, fields: 'first_name, last_name, photo_100' })
    }) 
    .then(data => {
        
        function reloadDragListener() {
            let persons = document.querySelectorAll('.person');

            [].forEach.call(persons, (item) => {
                item.addEventListener('dragstart', (evt) => {
                    evt.dataTransfer.setData('text', evt.target.id);
                    evt.dataTransfer.effectAllowed = 'move';
                });
            });
        }

        function allowDrop(evt) {
            evt.preventDefault();
        }

        function filterLeftList(item) {
            return item.first_name.indexOf(leftInput.value, 0) == 0
        }

        function filterRightList(item) {
            return item.first_name.indexOf(rightInput.value, 0) == 0
        }
        
        if (JSON.parse(localStorage.getItem('leftListFriends')) 
        && JSON.parse(localStorage.getItem('rightListFriends'))) {
            leftListPersons = JSON.parse(localStorage.getItem('leftListFriends'));
            rightListPersons = JSON.parse(localStorage.getItem('rightListFriends'));
            leftList.innerHTML = render({ users: leftListPersons });
            rightList.innerHTML = render({ users: rightListPersons });
        } else {
            leftListPersons = JSON.parse(JSON.stringify(data.items));
            leftList.innerHTML = render({ users: leftListPersons });
        }
        
        leftList.addEventListener('click', (evt) => {
            let classTag = evt.target.getAttribute('class');
            let elem = evt.target.previousSibling.previousSibling.innerHTML.split(' ');
             
            if (classTag === 'btnEvt') {
                for (let i=0; i<leftListPersons.length; i++) { 
                    if (leftListPersons[i].first_name == elem[0] & leftListPersons[i].last_name == elem[1]) {
                        rightListPersons.push(leftListPersons[i]);
                        leftListPersons.splice(i, 1);
                        leftList.innerHTML = render({ users: leftListPersons.filter(filterLeftList) });
                        rightList.innerHTML = render({ users: rightListPersons.filter(filterRightList) });
                    }
                }
            }
            reloadDragListener(); 
        });

        rightList.addEventListener('click', (evt) => {
            let classTag = evt.target.getAttribute('class');
            let elem = evt.target.previousSibling.previousSibling.innerHTML.split(' ');

            if (classTag === 'btnEvt') {
                for (let i=0; i<rightListPersons.length; i++) {
                    if (rightListPersons[i].first_name == elem[0] & rightListPersons[i].last_name == elem[1]) {
                        leftListPersons.push(rightListPersons[i]);
                        rightListPersons.splice(i, 1);
                        leftList.innerHTML = render({ users: leftListPersons.filter(filterLeftList) });
                        rightList.innerHTML = render({ users: rightListPersons.filter(filterRightList) });  
                    }
                }
            }
            reloadDragListener();
        });

        leftList.addEventListener('drop', (evt) => {
            let data = evt.dataTransfer.getData('text');
            let tagPerson = document.getElementById(data).getElementsByClassName('person');
            let elem = tagPerson[0].textContent.split(' ')

            for (let i=0; i<rightListPersons.length; i++) {
                if (rightListPersons[i].first_name == elem[0] & rightListPersons[i].last_name == elem[1]) {
                    leftListPersons.push(rightListPersons[i]);
                    rightListPersons.splice(i, 1);
                    leftList.innerHTML = render({ users: leftListPersons.filter(filterLeftList) });
                    rightList.innerHTML = render({ users: rightListPersons.filter(filterRightList) });
                }
            }
            reloadDragListener();
        });

        rightList.addEventListener('drop', (evt) => {
            evt.preventDefault();
            let data = evt.dataTransfer.getData('text');
            let tagPerson = document.getElementById(data).getElementsByClassName('person');
            let elem = tagPerson[0].textContent.split(' ')

            for (let i=0; i<leftListPersons.length; i++) { 
                if (leftListPersons[i].first_name == elem[0] & leftListPersons[i].last_name == elem[1]) {
                    rightListPersons.push(leftListPersons[i]);
                    leftListPersons.splice(i, 1);
                    leftList.innerHTML = render({ users: leftListPersons.filter(filterLeftList) });
                    rightList.innerHTML = render({ users: rightListPersons.filter(filterRightList) });
                }
            }
            reloadDragListener();
        });

        leftInput.addEventListener('keyup', function() {
            leftList.innerHTML = render({ users: leftListPersons.filter(filterLeftList) });
        });

        rightInput.addEventListener('keyup', function() {
            rightList.innerHTML = render({ users: rightListPersons.filter(filterRightList) });
        });

        leftList.addEventListener('dragover', allowDrop, false);
        rightList.addEventListener('dragover', allowDrop, false);
        reloadDragListener();

        btnSave.addEventListener('click', () => {
            localStorage.setItem('leftListFriends', JSON.stringify(leftListPersons))
            localStorage.setItem('rightListFriends', JSON.stringify(rightListPersons));
        })

    })
    .catch(function (e) {
        alert('Ошибка: ' + e.message);
    });