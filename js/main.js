let quiz = new Vue({
    el : '#app',
    data : {
        formTitle : '',
        answer : '',
        questionText : '',
        multipleText : '',
        choices : [{'choice' : ''}],
        selectOption : '',
        questionList : [],
        isCaretUp: false, 
        editStatus : false,
        currentEditId : null,
        answerValidateStatus : true,
        currentPage : 1,
        itemsPerPage : 5,
        previewMode : false,
        isMobile : false,
        darkModeStatus : false,
    },
    computed : {
        paginatedQuestions() {
            const descList = this.questionList.slice().reverse();
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            return descList.slice(startIndex,endIndex);
        },
        totalPages() {
            return Math.ceil(this.questionList.length/this.itemsPerPage);
        }
    },
    mounted() {
        const darkModeStored = localStorage.getItem('darkMode');
        if(darkModeStored!==null) {
            this.darkModeStatus = JSON.parse(darkModeStored);
        }
    },
    methods: {
        // dark mode switch 
        toggleDarkMode() {
            this.darkModeStatus = !(this.darkModeStatus);
            localStorage.setItem('darkMode', JSON.stringify(this.darkModeStatus));
        },
        //add to preview form
        addToForm() {
            this.validateAnswer();
            if(this.answerValidateStatus === true) {
                if(this.currentEditId === null) {
                    if (this.selectOption === 'option1') {
                        // const questionText = this.questionText;
                        this.questionList.push({'id':this.questionList.length,'questionText' : this.questionText,'answer': this.answer,'multipleText' : null , 'choices' : null});
                        this.questionText = '';
                        this.answer = '';
                    }
        
                    if (this.selectOption === 'option2') {
                        const multipleText = this.multipleText;
                        const choices = this.choices.map(c => c.choice);
                        this.questionList.push({
                            'id' : this.questionList.length,
                            'questionText' : null,
                            'multipleText' : multipleText ,
                            'choices' : choices,
                            'answer': this.answer
                        });
                        this.multipleText = '';
                        this.choices = [{'choice' : ''}];
                        this.answer = '';
                    }
                }else { //update form
                    this.questionList.forEach(q => {
                        if(q.id === this.currentEditId) {
                            if(q.questionText !== null) {
                                this.questionList = this.questionList.map(question=> {
                                    console.log(question.id , q.id)
                                    if (question.id === q.id) {
                                        return {
                                            'id':this.currentEditId ,
                                            'questionText': this.questionText ,
                                            'answer': this.answer,
                                            'multipleText' : null , 
                                            'choices' : null
                                        };
                                    }else {
                                        return question;
                                    }
                                });
                                this.questionText = '';
                                this.answer = '';
                            }else if(q.multipleText !== null) {
                                // console.log(q.id);
                                const multipleText = this.multipleText;
                                const choices = this.choices.map(c => c.choice);
                                this.questionList = this.questionList.map(question => {
                                    if (question.id === q.id) {
                                      return {
                                        id: this.currentEditId,
                                        multipleText: multipleText,
                                        choices: choices,
                                        answer: this.answer,
                                        questionText: null
                                      };
                                    } else {
                                      return question;
                                    }
                                });
                                this.multipleText = '';
                                this.choices = [{'choice' : ''}];
                                this.answer = '';
                            }
                        }
                    });
                    
                    this.currentEditId = null;
                    this.editStatus = false;
                }
                
                this.saveToLocalStorage();
            }
        },
        //add more multiple choice input 
        addChoice() {
            this.choices.push({choice:''});
            // this.choices = [...this.choices, { choice: '' }];
        },
        //remove one question
        removeQuestion(question_id) {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
              }).then((result) => {
                if (result.isConfirmed) {
                    const index = this.questionList.findIndex(q=>q.id==question_id);
                    this.questionList.splice(index,1);//delete user clicked index for 1 position in array with splice method
                    
                    for(let i = 0; i < this.questionList.length ;i++) {
                        this.questionList[i].id = i;
                    }
                    
                    this.saveToLocalStorage();
                    if(this.totalPages===1) {
                        this.currentPage = 1;
                    }
                    
                    Swal.fire(
                        'Deleted!',
                        'Your form has been deleted.',
                        'success'
                      )
                }
              })
            
        },
        // remove choice 
        removeChoice() {
            this.choices.pop();
        },
        // edit form 
        editForm(question_id) {
            this.previewMode = false;
            this.editStatus = true;
            this.questionList.forEach(q => {
                // console.log(q.id , question_id);
                
                if(q.id === question_id) {
                    if(q.questionText !== null) {
                        // console.log(q.questionText);

                        this.selectOption = 'option1';
                        this.questionText = q.questionText;
                    }else if (q.multipleText !== null ) {
                        // console.log(q.multipleText);

                        this.selectOption = 'option2';
                        this.choices = [];
                        this.multipleText = q.multipleText;
                        q.choices.forEach(c => {
                            this.choices.push({'choice':c});
                        }); 
                    }
                    this.answer = q.answer;
                    this.currentEditId = question_id;
                }
            });

        },
        
        //save questionList array to local storage
        saveToLocalStorage() {
            localStorage.setItem('formTitle',JSON.stringify(this.formTitle));
            localStorage.setItem('questionList',JSON.stringify(this.questionList));
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
        // toggel caret up / down 
        toggleCaret(){
            this.isCaretUp = !this.isCaretUp;
        },
        // delete all form 
        deleteAll() {
            this.formTitle = '';
            this.questionList.splice(0,this.questionList.length);
            localStorage.removeItem('questionList');
        },
        //answer validation
        validateAnswer() {
            if(this.answer == '') {
                this.answerValidateStatus = false;
            }else {
                this.answerValidateStatus = true;
            }
        },
        changePage(pageNumber) {
            if(pageNumber >= 1 && pageNumber <= this.totalPages) {
                this.currentPage = pageNumber;
            }
        },
        togglePreview(){
            if(this.previewMode === false) {
                this.$refs.previewToggle.innerHTML = `<i class="bi bi-plus-square me-2"></i>Create`;
                this.previewMode = true;
            }else if(this.previewMode === true) {
                this.$refs.previewToggle.innerHTML = `<i class="bi bi-ui-checks-grid me-2"></i>Preview`;
                this.previewMode = false;
            }
            
            
        },
        checkMobile(){
            this.isMobile = window.innerWidth < 768;
        }
    },
    created() {
        this.loadFromLocalStorage();
        this.checkMobile();
    }
})
