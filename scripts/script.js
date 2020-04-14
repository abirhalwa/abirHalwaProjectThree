$(function () {
    let typingText;  // a variable that holds the typing text
    let remainingText; // a variable used to hold untyped remaining text 
    let currentIndex = -1; // a variable to hold the index of the current character
    let wrongEntries;
    let html = ''; // a variable to style the the typing text with html
    let ticks; //a variable to hold setInterval function
    let seconds, minutes, hours;//time variables
    let touch = false;//a variable to indicate a device with a touchscreen

    // cashing some elements
    const $typingTextContainer = $('#typingTextContainer');
    const $typingDiv = $('#typingDiv');
    const $levelDiv = $('#levelDiv');
    const $resultDiv = $('#resultDiv');
    const $typewriterSound = $('#typewriter');
    const $errorSound = $('#error');
    const $textarea = $('textarea');
    //end of cashing

    // this code is used to make the typewriter effect
    const welcomeText = document.getElementById('welcome');
    const typewriter = new Typewriter(welcomeText, { loop: false });
    typewriter.typeString('TypingRabbit, the best tool to practice your typing!').start();
    // end of typewriter effect code

    // a function to hide a div and display another one
    function displayDivAndHideDiv($divToHide, $divToDisplay) {
        $divToHide.toggleClass('hidden');
        $divToHide.toggleClass('contentChild');
        $divToDisplay.toggleClass('hidden');
        $divToDisplay.toggleClass('contentChild');
    }

    // an event listener to a click  on "get started" button
    $('#getStarted').on('click', function () {
        displayDivAndHideDiv($('.home'), $levelDiv);
    });

    // an event listener to a click  on a "level" button
    $('.level').on('click', function () {
        wrongEntries = currentIndex = 0;
        remainingText = html = '';
        displayDivAndHideDiv($levelDiv, $typingDiv)
        if ($(this).attr('id') == 'basicButton') {
            typingText = 'practice makes perfect. everytime you repeat this lesson, your speed will increase.';
        }
        else if ($(this).attr('id') == 'intermediateButton') {
            typingText = 'Dogs were the first animals ever to be domesticated. They are usually playful, friendly, and listen to humans.';
        }
        else {
            typingText = 'energy equals mass * (multiplied by) the speed of light 2 (squared). The multiplication sign is usually left out, giving e is equal to mc 2 (squared).';
        }
        $typingTextContainer.text(typingText);
        remainingText = typingText;
        if (!touch) {
            modifyLetterStyle('');
        }
    });

    // a function to style the typed letter and to underline the current one 
    const modifyLetterStyle = function (letterStatus) {
        let oneLetter = remainingText.substring(0, 1);
        oneLetter = `<span class='underline'>${oneLetter}</span>`
        remainingText = remainingText.substring(1);
        if (letterStatus !== '') {
            html = html.replace('underline', letterStatus);
        }
        html = html + oneLetter;
        $typingTextContainer.html(html + remainingText);
    }

    // a function to start the timer
    const timerStart = function () {
        $('#timer').toggleClass('hidden');
        seconds = 0;
        minutes = 0;
        hours = 0;
        let time=0;
        let hoursString, minutesString, secondsString;
        const $timer = $('time');
        $timer.text('00: 00: 00');
        ticks = setInterval(function () {
            time++;
            hoursString=hours = Math.floor(time / 3600);
            minutesString= minutes = Math.floor(time / 60);
            secondsString= seconds = Math.floor(time % 60);
            if (minutes < 10) {
                minutesString = "0" + minutes;
            }
            if (seconds < 10) {
                secondsString = "0" + seconds;
            }
            if (hours < 10) {
                hoursString = "0" + hours;
            }
            $timer.text(`${hoursString} : ${minutesString} : ${secondsString}`);
        }, 1000);
    }

    // a function to calculate the result
    const calculateResult = function () {
        const correctEntries = typingText.length - wrongEntries;
        const accuracy = (correctEntries / typingText.length) * 100;
        $('#accuracy').text('Accuracy: ' + accuracy.toFixed(2) + ' %');
        const timeInMinutes = minutes + (hours * 60) + (seconds / 60);
        const numberOfWords = typingText.length / 5; //considring that the word length is 5 characters
        if (wrongEntries > numberOfWords) {
            //show an message to the user if he has too many mistakes and the speed can't be calculated
            $('#speed').text(`We can't calculate your speed because you have too many mistakes`);
        }
        else {
            const speed = (numberOfWords - wrongEntries) / timeInMinutes;
            $('#speed').text('Speed: ' + speed.toFixed(2) + ' WPM');
        }
    }

    // an event listener to a key press
    $(document).keypress(function (e) {
        if (!touch && currentIndex > -1 && currentIndex < typingText.length) {
            if (currentIndex === 0) {
                timerStart();
            }
            const typedChar = String.fromCharCode(e.which);
            let letterStatus = 'correct';
            if (typedChar !== typingText.charAt(currentIndex)) {
                $errorSound[0].play();
                wrongEntries++;
                letterStatus = 'wrong';
            }
            else {
                $typewriterSound[0].play();
            }
            modifyLetterStyle(letterStatus);
            currentIndex++;
            if (currentIndex === typingText.length) {
                clearInterval(ticks);
                calculateResult();
                displayDivAndHideDiv($typingDiv, $resultDiv);
                currentIndex = -1;
            }
        }
    });

    // an event listener to a click on "show levels" link
    $('#showLevel').on('click', function () {
        $('#timer').toggleClass('hidden');
        displayDivAndHideDiv($resultDiv, $levelDiv);
    });

    //an event listener to close the hamburger menu
    $('#closeHamburger').on('click', function (e) {
        e.preventDefault();
        $('header nav ul').toggleClass('');
    });

    //an event listener to show the instructions div
    $('#showInstructions').on('click', function (e) {
        e.preventDefault();
        $('.instructionsDiv').fadeIn(500);
    });

    //an event listener to hide the instructions div
    $('#close').on('click', function (e) {
        $('.instructionsDiv').fadeOut(500);
    });

    //*********all of the following code is for touch screen devices*****************
    // an event listener to screen touch
    window.addEventListener('touchstart', function () {
        if (!touch) {
            currentIndex = 0;
            $textarea.val('');
            $('form').css('display', 'block');
            $typingTextContainer.css('text-align', 'left');
            touch = true;
        }
    });

    // an event listener to a form submit
    $('form').on('submit', function (e) {
        e.preventDefault();
        if ($textarea.val() === '') {
            // showing an error message if the user tries to submit an empty typing form
            alert("You did not type any text!! you cant't submit the form without typing any text?");
            return;
        }
        for (let i = 0; i < typingText.length; i++) {
            if (typingText[i] !== $textarea.val()[i]) {
                wrongEntries++;
            }
        }
        clearInterval(ticks);
        calculateResult();
        touch = false;
        displayDivAndHideDiv($typingDiv, $resultDiv);
    });

    //an event listener to a keydown in the textarea
    $textarea.on('keydown', function (e) {
        if (currentIndex === 0) {
            timerStart();
        }
        currentIndex++;
    });
});