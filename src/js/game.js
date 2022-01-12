/*
    Random integer
 */

function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
}

/* 
Sound
*/

let start = false;
const engine = new Audio('../src/audio/start-game.mp3');
document.querySelector('.start-btn').addEventListener('click', function () {
    if (start === false) {
        start = true;
        engine.play();
    }

})


function gameOver() {

    const data = {
        name: player.name,
        points: points,
        type: type
    };

    points = 0;
    $('.inner-points').text(points);

    document.querySelector('.game-over').classList.add('on');
}

/*
    Restart Game
 */

function next() {

    player.hp -= 1;

    clearInterval(ints.enemy);
    clearInterval(ints.run);
    clearInterval(ints.bullet);
    clearInterval(ints.generateEnemy);
    clearInterval(ints.enemyBullet);
    clearInterval(ints.checkEnemyBulletForPlayer);
    clearInterval(ints.enemyShots);

    let enemies = document.querySelectorAll('.enemy');

    enemies.forEach((enemy) => { // перебираю и удалчю игрока
        enemy.parentNode.removeChild(enemy);
    });

    let enemyBullets = document.querySelectorAll('.enemy-bullet');

    enemyBullets.forEach((bullet) => {
        bullet.parentNode.removeChild(bullet);
    });

    let bullets = document.querySelectorAll('.bullet');

    bullets.forEach((bullet) => {
        bullet.parentNode.removeChild(bullet);
    });

    player.el.parentNode.removeChild(player.el);

    if (player.hp === 0) {
        return gameOver();
    }

    game();
}


/*
    Init
 */

function init() {

    if (player.hp === 0) {
        player.hp = 2;
        points = 0;
    }

    $('.inner-name').text(player.name);

    document.querySelector('.game-over').classList.remove('on');

    player.x = gameZone.getBoundingClientRect().width / 2 - player.w;
    player.y = gameZone.getBoundingClientRect().height - player.h;

    gameZone.innerHTML += `<div class="player" style="left: ${player.x}px; top: ${player.y}px;"></div>`;
    player.el = document.querySelector('.player');

    switch (player.hp) {
        case 2:
            document.querySelector('.life').innerHTML = `<img src="src/sprites/heart-1.png" class="life__image">`;
            break;
        case 1:
            document.querySelector('.life').innerHTML = `<img src="src/sprites/heart-2.png" class="life__image">`;
            break;
        case 0:
            document.querySelector('.life').innerHTML = `<img src="src/sprites/heart-3.png" class="life__image">`;
            break;
    }


}

/*
    Intervals
 */

function intervals() {
    ints.run = setInterval(() => { // движение самого игрока
        if (player.run) {
            switch (player.side) {  // здесь проферяю в какую сторону я двигаюсь
                case 1: // Top
                    if (player.y > 0) {
                        player.y -= player.step;
                        player.el.style.top = `${player.y}px`;
                    }
                    break;
                case 3: // Bottom ниже условие в котором я ч/з метод getBoundingClientRect узнаю позицию по правой стороне
                    if (player.y < gameZone.getBoundingClientRect().bottom - player.h - 2) {
                        player.y += player.step;
                        player.el.style.top = `${player.y}px`;
                    }
                    break;
                case 2: // Right
                    if (player.x < gameZone.getBoundingClientRect().right - player.w - 2) {
                        player.x += player.step;
                        player.el.style.left = `${player.x}px`;
                    }
                    break;
                case 4: // Left=
                    if (player.x > 0) { // здесь я прописываю условие чтобы танчик не уезжал вникуда влево
                        player.x -= player.step;
                        player.el.style.left = `${player.x}px`;
                    }
                    break;
            }
        }
    }, fps);
    ints.bullet = setInterval(() => {  //фун-ция чтобы выстрел двигался. через querySelertorAll я ищу все bullet и через forEach я перебираю все bullet
        let bullets = document.querySelectorAll('.bullet');
        bullets.forEach((bullet) => {
            let direction = bullet.getAttribute('direction');

            switch (direction) { //запускаю swith, где проверяю direction и через case будем двигать в нужное направление
                case 'top':
                    if (bullet.getBoundingClientRect().top < 0) {
                        bullet.parentNode.removeChild(bullet); // удаляем пуля когда достигнет края экрана
                    } else {
                        bullet.style.top = bullet.getBoundingClientRect().top - bulletSpeed + 'px';
                    }
                    break;
                case 'right':
                    if (bullet.getBoundingClientRect().right > gameZone.getBoundingClientRect().width) {
                        bullet.parentNode.removeChild(bullet);
                    } else {
                        bullet.style.left = bullet.getBoundingClientRect().left + bulletSpeed + 'px';
                    }
                    break;
                case 'bottom':
                    if (bullet.getBoundingClientRect().bottom > gameZone.getBoundingClientRect().height) {
                        bullet.parentNode.removeChild(bullet);
                    } else {
                        bullet.style.top = bullet.getBoundingClientRect().top + bulletSpeed + 'px';
                    }
                    break;
                case 'left':
                    if (bullet.getBoundingClientRect().left < 0) {
                        bullet.parentNode.removeChild(bullet);
                    } else {
                        bullet.style.left = bullet.getBoundingClientRect().left - bulletSpeed + 'px';
                    }
                    break;
            }

        })
    }, fps);
    ints.enemyBullet = setInterval(() => { // ф-ция описывает выстрелы ыврагов
        let bullets = document.querySelectorAll('.enemy-bullet');
        bullets.forEach((bullet) => {
            let direction = bullet.getAttribute('direction');

            switch (direction) {
                case 'top':
                    if (bullet.getBoundingClientRect().top < 0) {
                        bullet.parentNode.removeChild(bullet);
                    } else {
                        bullet.style.top = bullet.getBoundingClientRect().top - enemyBulletSpeed + 'px';
                    }
                    break;
                case 'right':
                    if (bullet.getBoundingClientRect().right > gameZone.getBoundingClientRect().width) {
                        bullet.parentNode.removeChild(bullet);
                    } else {
                        bullet.style.left = bullet.getBoundingClientRect().left + enemyBulletSpeed + 'px';
                    }
                    break;
                case 'bottom':
                    if (bullet.getBoundingClientRect().bottom > gameZone.getBoundingClientRect().height) {
                        bullet.parentNode.removeChild(bullet);
                    } else {
                        bullet.style.top = bullet.getBoundingClientRect().top + enemyBulletSpeed + 'px';
                    }
                    break;
                case 'left':
                    if (bullet.getBoundingClientRect().left < 0) {
                        bullet.parentNode.removeChild(bullet);
                    } else {
                        bullet.style.left = bullet.getBoundingClientRect().left - enemyBulletSpeed + 'px';
                    }
                    break;
            }

        })
    }, fps)
    ints.enemy = setInterval(() => { //фун-ция создает врага
        let enemies = document.querySelectorAll('.enemy'); // ищем все enemy, затем перебираем все enemies
        enemies.forEach((enemy) => { // здесь я отслеживаю столконовение игрокоа

            const playerPosTop = player.el.getBoundingClientRect().top,
                playerPosRight = player.el.getBoundingClientRect().right,
                playerPosBottom = player.el.getBoundingClientRect().bottom,
                playerPosLeft = player.el.getBoundingClientRect().left,
                enemyPosTop = enemy.getBoundingClientRect().top,
                enemyPosRight = enemy.getBoundingClientRect().right,
                enemyPosBottom = enemy.getBoundingClientRect().bottom,
                enemyPosLeft = enemy.getBoundingClientRect().left;


            if (
                playerPosTop < enemyPosBottom &&
                playerPosBottom > enemyPosTop &&
                playerPosRight > enemyPosLeft &&
                playerPosLeft < enemyPosRight
            ) {
                next();
                //alert('Столкновение')
            }


            let bullets = document.querySelectorAll('.bullet');

            bullets.forEach((bullet) => {

                let direction = bullet.getAttribute('direction');

                if (['top', 'left', 'right'].includes(direction)) {
                    if (
                        bullet.getBoundingClientRect().top < enemy.getBoundingClientRect().bottom &&
                        bullet.getBoundingClientRect().bottom > enemy.getBoundingClientRect().top &&
                        bullet.getBoundingClientRect().right > enemy.getBoundingClientRect().left &&
                        bullet.getBoundingClientRect().left < enemy.getBoundingClientRect().right
                    ) {
                        enemy.parentNode.removeChild(enemy);
                        bullet.parentNode.removeChild(bullet);
                        points += 1;
                        document.querySelector('.inner-points').innerText = points;
                    }
                } else {
                    if (
                        bullet.getBoundingClientRect().bottom > enemy.getBoundingClientRect().top &&
                        bullet.getBoundingClientRect().right > enemy.getBoundingClientRect().left &&
                        bullet.getBoundingClientRect().left < enemy.getBoundingClientRect().right
                    ) {
                        enemy.parentNode.removeChild(enemy);
                        bullet.parentNode.removeChild(bullet);
                        points += 1; // когда убиваем врага обращаемся к points + 1? затем обращаемся к inner-points и через inner добавляем points 
                        document.querySelector('.inner-points').innerText = points;
                    }
                }

            });

            let direction = enemy.getAttribute('direction');

            switch (direction) { //Движение врагов
                case 'right':
                    if (enemy.getBoundingClientRect().left <= 0) {
                        enemy.parentNode.removeChild(enemy);
                    } else {
                        enemy.style.left = enemy.getBoundingClientRect().left - 3 + 'px';
                    }
                    break;
                case 'left':
                    if (enemy.getBoundingClientRect().left >= gameZone.getBoundingClientRect().width) {
                        enemy.parentNode.removeChild(enemy);
                    } else {
                        enemy.style.left = enemy.getBoundingClientRect().left + 3 + 'px';
                    }
                    break;
                case 'top':
                    if (enemy.getBoundingClientRect().top <= 0) {
                        enemy.parentNode.removeChild(enemy);
                    } else {
                        enemy.style.top = enemy.getBoundingClientRect().top - 3 + 'px';
                    }
                    break;
                case 'bottom':
                    if (enemy.getBoundingClientRect().bottom >= gameZone.getBoundingClientRect().height) {
                        enemy.parentNode.removeChild(enemy);
                    } else {
                        enemy.style.top = enemy.getBoundingClientRect().top + 3 + 'px';
                    }
                    break;
            }

        })
    }, fps);
    ints.generateEnemy = setInterval(() => { // здесь рандомно создаем игроков

        let direction = randomInteger(1, 4); // рандомно генерирую число от 1 до 4

        switch (direction) {
            case 1: //Top
                gameZone.innerHTML += `<div class="enemy" style="transform: rotate(-90deg); top: ${gameZone.getBoundingClientRect().height - player.h}px; left: ${randomInteger(0, gameZone.getBoundingClientRect().width - player.w)}px" direction="top"></div>`;
                break;
            case 2: //Left
                gameZone.innerHTML += `<div class="enemy" style="transform: rotate(-180deg); top: ${randomInteger(0, gameZone.getBoundingClientRect().height - player.h)}px; left: ${gameZone.getBoundingClientRect().width - player.w}px;" direction="right"></div>`;
                break;
            case 3: //Bottom
                gameZone.innerHTML += `<div class="enemy" style="transform: rotate(90deg); top: 0; left: ${randomInteger(0, gameZone.getBoundingClientRect().width - player.w)}px;" direction="bottom"></div>`;
                break;
            case 4: //Right
                gameZone.innerHTML += `<div class="enemy" style="top: ${randomInteger(0, gameZone.getBoundingClientRect().height - player.h)}px; left: 0;" direction="left"></div>`;
                break;
        }


        player.el = document.querySelector('.player');  // каждый раз когда создаю врага я инициализируюсь
    }, enemyGenerateSpeed);
    ints.enemyShots = setInterval(() => { // выстрел врагов по игроку
        let enemies = document.querySelectorAll('.enemy');
        enemies.forEach((enemy) => {

            let direction = enemy.getAttribute('direction');

            switch (direction) {
                case 'right':
                    if (
                        player.el.getBoundingClientRect().top > enemy.getBoundingClientRect().top &&
                        player.el.getBoundingClientRect().top < enemy.getBoundingClientRect().bottom &&
                        player.el.getBoundingClientRect().right < enemy.getBoundingClientRect().left
                    ) {
                        // alert('в зоне видимости')
                        gameZone.innerHTML += `<div class="enemy-bullet" direction="left" style="left: ${enemy.getBoundingClientRect().left}px; top: ${enemy.getBoundingClientRect().top + 30}px;"></div>`;
                        player.el = document.querySelector('.player');
                    }
                    if (enemy.getBoundingClientRect().left <= 0) {
                        enemy.parentNode.removeChild(enemy);
                    } else {
                        enemy.style.left = enemy.getBoundingClientRect().left - 3 + 'px';
                    }
                    break;
                case 'left':
                    if (
                        player.el.getBoundingClientRect().top > enemy.getBoundingClientRect().top &&
                        player.el.getBoundingClientRect().top < enemy.getBoundingClientRect().bottom &&
                        player.el.getBoundingClientRect().left > enemy.getBoundingClientRect().right
                    ) {
                        gameZone.innerHTML += `<div class="enemy-bullet" direction="right" style="left: ${enemy.getBoundingClientRect().right}px; top: ${enemy.getBoundingClientRect().top + enemy.getBoundingClientRect().height / 2 - 10}px;"></div>`;
                        player.el = document.querySelector('.player');
                    }

                    if (enemy.getBoundingClientRect().left >= gameZone.getBoundingClientRect().width) {
                        enemy.parentNode.removeChild(enemy);
                    } else {
                        enemy.style.left = enemy.getBoundingClientRect().left + 3 + 'px';
                    }
                    break;
                case 'top':

                    if (
                        player.el.getBoundingClientRect().bottom < enemy.getBoundingClientRect().top &&
                        player.el.getBoundingClientRect().right > enemy.getBoundingClientRect().left &&
                        player.el.getBoundingClientRect().right < enemy.getBoundingClientRect().right
                    ) {
                        gameZone.innerHTML += `<div class="enemy-bullet" direction="top" style="left: ${enemy.getBoundingClientRect().left + enemy.getBoundingClientRect().width / 2 - 10}px; top: ${enemy.getBoundingClientRect().top}px;"></div>`;
                        player.el = document.querySelector('.player');
                    }

                    if (enemy.getBoundingClientRect().top <= 0) {
                        enemy.parentNode.removeChild(enemy);
                    } else {
                        enemy.style.top = enemy.getBoundingClientRect().top - 3 + 'px';
                    }
                    break;
                case 'bottom':

                    if (
                        player.el.getBoundingClientRect().top > enemy.getBoundingClientRect().bottom &&
                        player.el.getBoundingClientRect().right > enemy.getBoundingClientRect().left &&
                        player.el.getBoundingClientRect().right < enemy.getBoundingClientRect().right
                    ) {
                        gameZone.innerHTML += `<div class="enemy-bullet" direction="bottom" style="left: ${enemy.getBoundingClientRect().left + enemy.getBoundingClientRect().width / 2 - 10}px; top: ${enemy.getBoundingClientRect().bottom}px;"></div>`;
                        player.el = document.querySelector('.player');
                    }

                    if (enemy.getBoundingClientRect().bottom >= gameZone.getBoundingClientRect().height) {
                        enemy.parentNode.removeChild(enemy);
                    } else {
                        enemy.style.top = enemy.getBoundingClientRect().top + 3 + 'px';
                    }
                    break;
            }

            // if (enemy.getBoundingClientRect().right >= gameZone.getBoundingClientRect().width) {
            //     enemy.parentNode.removeChild(enemy);
            // } else {
            //     enemy.style.left = enemy.getBoundingClientRect().left + 3 + 'px';
            // }

        })
    }, enemyShotsSpeed)
    ints.checkEnemyBulletForPlayer = setInterval(() => { // ф-ции описывает попадание пули в врага в меня, а также уменьшение моих жизней
        let bullets = document.querySelectorAll('.enemy-bullet');
        bullets.forEach((bullet) => {

            let direction = bullet.getAttribute('direction');

            if (['top', 'left', 'right'].includes(direction)) {
                if (
                    bullet.getBoundingClientRect().top < player.el.getBoundingClientRect().bottom &&
                    bullet.getBoundingClientRect().bottom > player.el.getBoundingClientRect().top &&
                    bullet.getBoundingClientRect().right > player.el.getBoundingClientRect().left &&
                    bullet.getBoundingClientRect().left < player.el.getBoundingClientRect().right
                ) {
                    next();
                    bullet.parentNode.removeChild(bullet);
                }
            } else {
                if (
                    bullet.getBoundingClientRect().bottom > player.el.getBoundingClientRect().top &&
                    bullet.getBoundingClientRect().right > player.el.getBoundingClientRect().left &&
                    bullet.getBoundingClientRect().left < player.el.getBoundingClientRect().right
                ) {
                    next();
                    bullet.parentNode.removeChild(bullet);
                }
            }

        });
    }, fps)
}

/*
    Add Bullet
 */

function addBullet() {  // в этой фун-ции добавляем пульку с нужной стороны

    switch (player.side) {
        case 1:
            gameZone.innerHTML += `<div class="bullet" direction="top" style="left: ${(player.x + (player.w / 2)) - 7}px; top: ${player.y - 16}px;"></div>`;
            break;
        case 2:
            gameZone.innerHTML += `<div class="bullet" direction="right" style="left: ${player.x + player.w}px; top: ${player.y + 30}px;"></div>`;
            break;
        case 3:
            gameZone.innerHTML += `<div class="bullet" direction="bottom" style="left: ${player.x + player.w / 2 - 5}px; top: ${player.y + player.h}px;"></div>`;
            break;
        case 4:
            gameZone.innerHTML += `<div class="bullet" direction="left" style="left: ${player.x}px; top: ${player.y + player.h / 2 - 10}px;"></div>`;
            break;
    }

    player.el = document.querySelector('.player'); // по новой инициализирую игрока
}

/*
    Controllers фун-ци отвечает за движение игрока
 */

function controllers() {
    document.addEventListener('keydown', (e) => {     // здесь через addEventListener отслеживаем события нажатия на кнопку 

        //console.log(e.keyCode)

        switch (e.keyCode) {  //через swith я каждому case прописываю значение
            case 38: // Top
                player.el.style.backgroundImage = `url(${player.sprites.top})`;
                player.run = true;
                player.side = 1;
                break;
            case 40: // Bottom
                player.el.style.backgroundImage = `url(${player.sprites.bottom})`;
                player.run = true;
                player.side = 3;
                break;
            case 39: // Right
                player.el.style.backgroundImage = `url(${player.sprites.right})`;
                player.run = true;
                player.side = 2;
                break;
            case 37: //Left
                player.el.style.backgroundImage = `url(${player.sprites.left})`;
                player.run = true;
                player.side = 4;
                break;
            case 65: //Shot
                addBullet();
                break;
        }

    });

    document.addEventListener('keyup', (e) => {
        if ([38, 40, 39, 37].includes(e.keyCode))
            player.run = false;
    })




    document.addEventListener('mousedown', (e) => {     // здесь через addEventListener отслеживаем события нажатия на кнопку 

        console.log(e.offsetX)
        console.log(e.offsetY)
        console.log(player.offsetY)

        if (e.offsetY < player.y && Math.abs(e.offsetY - player.y) > Math.abs(e.offsetX - player.x)) {   // 500 -400 (320-300)
            player.el.style.backgroundImage = `url(${player.sprites.top})`;
            player.run = true;
            player.side = 1;
        } else if (e.offsetY > player.y && Math.abs(e.offsetY - player.y) > Math.abs(e.offsetX - player.x)) {
            player.el.style.backgroundImage = `url(${player.sprites.bottom})`;
            player.run = true;
            player.side = 3;
        } else if (e.offsetX > player.x) {
            player.el.style.backgroundImage = `url(${player.sprites.right})`;
            player.run = true;
            player.side = 2;
        } else {
            player.el.style.backgroundImage = `url(${player.sprites.left})`;
            player.run = true;
            player.side = 4;
        }


    });

    document.addEventListener('mouseup', (e) => {
        player.run = false;
    })


}


/*
    Start Game    здесь я запускаю все нужные мне функции
 */

function game() {
    init();
    controllers();
    intervals();
}

let gameZone = document.querySelector('.game-zone'),
    points = 0,
    fps = 1000 / 60,
    player = {               // здесь я сохранил всю инфу по игроку
        name: '',
        sprites: { // создал sprites в ввиде объекта и в controllers я буду менять sprites на нужный
            top: 'src/sprites/player-top.png',
            right: 'src/sprites/player-right.png',
            bottom: 'src/sprites/player-bottom.png',
            left: 'src/sprites/player-left.png',
        },
        el: false,
        x: 500,
        y: 400,
        step: 10,
        run: false,
        side: 1, //1 (top), 2 (right), 3 (bottom), 4 (left),
        w: 78,
        h: 77,
        hp: 2
    },
    bulletSpeed = 10,
    enemyBulletSpeed = 10,
    enemyGenerateSpeed = 1000,
    enemyShotsSpeed = 1000,
    ints = { // переменные для intervalls
        run: false,
        bullet: false,
        enemyBullet: false,
        enemy: false,
        generateEnemy: false,
        enemyShots: false,
        checkEnemyBulletForPlayer: false,
        test: false
    },
    type = '',
    test = []


$('.levels__item').click(function () {
    $('.levels__item').removeClass('active');
    $(this).addClass('active');

    type = $(this).attr('type');

    switch (type) { // прописываем уровни для игрока
        case 'light': document
            $('.level-inner').text('Light')
            enemyBulletSpeed = 5;
            enemyGenerateSpeed = 2000;
            enemyShotsSpeed = 1500;
            break;
        case 'medium':
            $('.level-inner').text('Medium')
            enemyBulletSpeed = 10;
            enemyGenerateSpeed = 1000;
            enemyShotsSpeed = 1000;
            break;
        case 'hard':
            $('.level-inner').text('Hardstyle')
            enemyBulletSpeed = 15;
            enemyGenerateSpeed = 500;
            enemyShotsSpeed = 500;
            break;
    }

});

$('.start-btn').click(function () {
    player.name = $('.name-input').val();
    $('.start-panel').removeClass('on')
    game();
});

// уход со страницы 

window.onbeforeunload = function () {
    return confirm('Вы хотите покинуть сайт?')
}

// запуск preloader

window.onload = function () {
    setTimeout(function () {
        let preloader = document.getElementById('preloader');
        preloader.classList.add('hide-preloader');
    }, 2500)
};
