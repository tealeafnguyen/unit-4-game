
$(document).ready(function () {    
    var playerLevel = 0;
    var playerId, currEnemyId, playerHp, currEnemyHp, currEnemyAtk;
    var inCombat = false;
    var inUse = [];

    var characters = [
        {
            'name': 'Chewy',
            'hp': 100,
            'attack': [10, 20, 30, 40, 50, 60],
            'counter': 10
        },

        {
            'name': 'Boba',
            'hp': 75,
            'attack': [15, 30, 40, 40, 50, 80],
            'counter': 5
        },

        {
            'name': 'Phasma',
            'hp': 80,
            'attack': [10, 25, 40, 50, 50, 65],
            'counter': 5
        },

        {
            'name': 'Jar Jar',
            'hp': 50,
            'attack': [40, 50, 60, 70, 80, 100],
            'counter': 5
        },

        {
            'name': 'Darth Helmet',
            'hp': 100,
            'attack': [11, 22, 33, 44, 55, 66],
            'counter': 20
        }
    ]

    function genChars() {
        for (let i = 0; i < characters.length; i++) {
            $('.characterSelect').append(`<div class="col-2-md character pc back" id= '${i}'>
            <img class="img character rounded-circle" src="assets/images/c${i}.jpg">
            <p>${characters[i].name}</p>
            <p>HP: ${characters[i].hp}</p>
            <p>Base attack: ${characters[i].attack[playerLevel]}</p>
            </div>`);
        }
    }

    function reGenChars() {

        for (let i = 0; i < characters.length; i++) {
            if (!canPick(i)) {
                $('.characterSelect').append(`<div class="col-2-md character fightable back" id= '${i}'>
                <img class="img character rounded-circle" src="assets/images/c${i}.jpg">
                <p>${characters[i].name}</p>
                <p>HP: ${characters[i].hp}</p>
                <p>Counter: ${characters[i].counter}</p>
                </div>`);
            }

        }
    }

    function canPick(charID) {
        for (var i = 0; i < inUse.length; i++) {
            if (charID == inUse[i]) {
                return true;
            }
        }
        return false;
    }

    function genLand() {
        var genNum = Math.floor(Math.random() * 4);
        $('.battleZone').css('background-image', `url(assets/images/a${genNum}.jpg)`);
        $('.battleZone').css('pointer-events', `auto`);

    }

    function removeLand() {
        $('.battleZone').css('background-image', '');
        $('.battleZone').css('pointer-events', `none`);
    }

    $('.instructions').on('click', function(){
        $('.instructions').css('display', 'none');
    })

    $(document).on('click', '.pc', function () {
        $('.instructions').css('display', 'none');
        console.log($(this).attr('id'));
        playerId = $(this).attr('id');
        inUse.push(playerId);
        playerHp = characters[playerId].hp;
        $(this).parent().html('');
        $('.pcBox').append(`<div class='col player'>
        <img class="pcImg rounded-circle" src="assets/images/c${playerId}.jpg">
        </div>
        <div class='col playerStats'>
        <p>HP: ${playerHp}</p>
        <p>Attack: ${characters[playerId].attack[playerLevel]}</p>
        </div>
        `);
        reGenChars();
    });

    $(document).on('click', '.fightable', function () {
        if (!inCombat) {
            inCombat = true;
            currEnemyId = $(this).attr('id');
            inUse.push(currEnemyId);
            currEnemyAtk = characters[currEnemyId].counter;
            currEnemyHp = characters[currEnemyId].hp;
            genLand();
            console.log('You chose to fight ' + characters[currEnemyId].name);
            $(this).parent().html('');
            $('.battleZone').append(`<div class='enemy col'>
            <img class="enImg pcImg rounded-circle" src="assets/images/c${currEnemyId}.jpg">
            <h2>HP: ${currEnemyHp}</h2>
            <h2>Attack: ${currEnemyAtk}</h2>
            </div>
            `);
            $('.battleZone').append(`<div class='controls col'>
            <button type="button" class="btn btn-danger attack" style="margin-top:50px">Attack</button>
            </div>
            `);
        }

    })

    function updatePlayer() {
        $('.playerStats').html(`<p>HP: ${playerHp}</p>
            <p>Attack: ${characters[playerId].attack[playerLevel]}</p>`);
    }

    function updateEnemy() {
        $('.enemy').html(`<img class="enImg pcImg rounded-circle" src="assets/images/c${currEnemyId}.jpg">
        <h2>HP: ${currEnemyHp}</h2>
        <h2>Attack: ${currEnemyAtk}</h2>`)
    }

    function checkWin() {
        if ((inUse.length == characters.length) && !inCombat) {
            $('.battleZone').html(`<img src="assets/images/win.jpg" alt="YOU ARE WINRAR" style="background-size: cover; width: 100%; height: 100%">`);
            alert('you win');
            $('.playerStats').html(`<button type="button" class="btn btn-info reset" style="margin-top:50px">Reset Game</button>`);
        }
    }

    $(document).on('click', '.attack', function () {
        console.log('You attacked');
        currEnemyHp = currEnemyHp - characters[playerId].attack[playerLevel];
        updateEnemy();

        if (currEnemyHp > 0) {
            console.log('enemy counters');
            playerHp = playerHp - currEnemyAtk;
            updatePlayer();
        }

        if (currEnemyHp <= 0) {
            console.log('enemy defeated')
            playerLevel++;
            inCombat = false;
            $('.battleZone').html('');
            removeLand();
            updatePlayer();
            reGenChars();
        }

        if (playerHp <= 0) {
            $('.battleZone').html(`<img src="assets/images/youdied.jpg" alt="YOU DIED" style="background-size: cover; width: 100%; height: 100%">`);
            alert('You died');
            $('.playerStats').html(`<button type="button" class="btn btn-info reset" style="margin-top:50px">Reset Game</button>`);
        }

        checkWin();
    })

    $(document).on('click', '.reset', function(){
        console.log('resetting game');
        inUse = [];
        playerLevel = 0;
        inCombat = false;
        $('.battleZone').html('');
        removeLand();
        $('.pcBox').html('');
        genChars();

    })

    genChars();
})