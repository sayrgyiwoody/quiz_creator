new Vue({
    el : '#answer-form',
    data : {
        formTitle : '',
        selectedChoice : '',
        answer : '',
        questionText : '',
        multipleText : '',
        questionList : '',
        currentQuiz : 1,
        answerStatus : null,
        marks : 0,
        try : 1,
        darkModeStatus : false,
        answerMessage : '',
        nextQuiz : 'Next Quiz',
    },
    computed : {
        paginatedQuizzes() {
            return this.questionList.slice(this.currentQuiz-1,this.currentQuiz);
        }
    },
    created() {
        this.loadFromLocalStorage();
    },
    mounted() {
        const darkModeStored = localStorage.getItem('darkMode');
        if(darkModeStored!==null) {
            this.darkModeStatus = JSON.parse(darkModeStored);
        }
    },
    methods: {
        // toggle dark mode
        toggleDarkMode() {
            this.darkModeStatus = !(this.darkModeStatus);
            localStorage.setItem('darkMode', JSON.stringify(this.darkModeStatus));
        },
        //load questionList from local storage
        loadFromLocalStorage() {
            const localQuestionList = localStorage.getItem('questionList');
            const localFormTitle = localStorage.getItem('formTitle');
            if(localQuestionList) {
                this.questionList = JSON.parse(localQuestionList);
                this.formTitle = JSON.parse(localFormTitle);
            }
        },
        checkAnswer(quiz_id){
            // console.log(this.selectedChoice);
            if((this.selectedChoice!=='' || this.answer !== '') && this.answerStatus !== true) {
                if(this.selectedChoice === this.questionList[quiz_id].answer || this.answer === this.questionList[quiz_id].answer) {
                    if(this.try===1) {
                        // Swal.fire({
                        //     imageUrl: '../images/success.gif',
                        //     imageHeight: 200,
                        //     imageAlt: 'success',
                        //     title: 'Hrr Sayrgyi',
                        //     text: "Your answer is correct !",
                        //     confirmButtonColor: '#4A54CF',
                        //     confirmButtonText: 'Ok'
                        // });
                        this.marks = this.marks + 1;
                        this.try--;
                        this.nextQuiz = (this.currentQuiz === this.questionList.length)? 'View Your Marks' : 'Next Quiz';
                    }else {
                        // Swal.fire({
                        //     imageUrl: '../images/good.gif',
                        //     imageHeight: 200,
                        //     imageAlt: 'success',
                        //     title: 'Yayy',
                        //     text: "You are correct and now you can move to the next question.",
                        //     confirmButtonColor: '#4A54CF',
                        //     confirmButtonText: 'Ok'
                        // });
                    }
                    this.answerStatus = true;
                    this.answerMessage = '<i class="fa-solid fa-thumbs-up me-2"></i>Your answer is correct and now you can move to the next quiz.';

                }else {
                    // Swal.fire({
                    //     imageUrl: '../images/fail.gif',
                    //     imageHeight: 200,
                    //     title: 'Try again?',
                    //     text: "Your answer is incorrect !",
                    //     confirmButtonColor: '#4A54CF',
                    //     confirmButtonText: 'Ok'
                    // });
                    this.answerStatus = false;
                    this.answerMessage = '<i class="fa-solid fa-thumbs-down me-2"></i>Your answer is incorrect, try again for the correct answer.';
                    if(this.try === 1) {
                        this.try--;
                    }
                }
            }
        },
        changeQuiz(quizNumber) {
            
            this.try = 1;
            this.answerStatus = null;
            this.currentQuiz = quizNumber;
            this.selectedChoice = '';
            this.answer = '';

            if(quizNumber === (this.questionList.length + 1)) {
                const marks = Math.floor(this.marks / (this.questionList.length/100));
                Swal.fire({
                    title: 'Congratulations',
                    html: `<b class="text-primary fs-4">You got ${marks}/100 marks.</b>`,
                    imageUrl: '../images/congratulation.gif',
                    imageAlt: 'Congratulation',
                    confirmButtonText: 'Restart',
                }).then((result)=> {
                    if(result.isConfirmed) {
                        this.marks = 0;
                        this.currentQuiz = 1;
                    }
                });
            }

        },
        showAnswer(question_id) {
            Swal.fire({
                title: 'Need answer?',
                text: "You won't get any marks if you request for the answer,",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText : "No, I'll try myself"
              }).then((result) => {
                if (result.isConfirmed) {
                    this.try--;
                    Swal.fire({
                        title: 'Answer for Quiz ' + this.currentQuiz ,
                        html: `<b class="text-primary fs-4">${this.questionList[question_id].answer}</b>`,
                        imageUrl: '../images/hint.gif',
                        imageAlt: 'Answer Show',
                    });
                }
              })
            
        },
        
    },

})
