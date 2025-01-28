class Figure{
    constructor(array, color, size, type, position){
        this.array = array;
        this.color = color;
        this.size = size;
        this.type = type
        this.position = position
        this.isFreeze = false
    }
}

let scoreDOM = document.getElementById('score')

function applyIndexes(bigArray, indexArray, value) {
    // 1. Перебираем массив индексов
    for (let i = 0; i < indexArray.length; i++) {
        const indexPair = indexArray[i];
  
        // 2. Извлекаем индексы
        const rowIndex = indexPair[0]; // Индекс строки
        const colIndex = indexPair[1]; // Индекс столбца
          
        // Проверка: убедимся, что индексы находятся в пределах границ
         if (rowIndex >= 0 && rowIndex < bigArray.length && colIndex >= 0 && colIndex < bigArray[0].length) {
              // 3. Помещаем значение в большой массив
              bigArray[rowIndex][colIndex] = value;
          }
           else {
              console.error(`Некорректные индексы: ${rowIndex}, ${colIndex}`);
          }
    }
    return bigArray;
  }

L = new Figure(
    [
        [1,0],
        [1,0],
        [1,1],
    ],
    'red',
    3,
    'L',
    'vertical_right'
);

Z = new Figure(
    [
        [1,0,0],
        [1,1,0],
        [0,1,0]
    ],
    'green',
    3,
    'Z',
    'vertical_right'
);

T = new Figure([
    [1,0,0],
    [1,1,0],
    [1,0,0],
    ],
    '#e39905',
    3,
    'T',
    'vertical_right'
);

O = new Figure(
    [
        [1,1],
        [1,1]
    ],
    '#2307db',
    4,
    'O',
    'center'
);

I = new Figure(
    [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]
    ],
    '#b8049a',
    4,
    'I',
    'vertical_right'
)

J = new Figure(
    [
        [0,1,0],
        [0,1,0],
        [1,1,0]
    ],
    '#06b3bf',
    3,
    'J',
    'vertical_right'
);

//z и s перепутал местами название - да простит меня главнокомандующий
S = new Figure(
    [
        [0,1,0],
        [1,1,0],
        [1,0,0]
    ],
    '#43960f',
    3,
    'S',
    'vertical_right'
);

let array_figures = [S,T,O,L,I,J,T,Z]

//функция которая возвращает случайную фигуру
let randomFigure = function(arr){
    if(!arr || arr.length == 0){
        console.log('массивс фигурами пустой')
    }
    let randomIndex = Math.floor(Math.random() * arr.length)
    return arr[randomIndex]
}

//функция которая меняет значения фигуры 1 на 2 и перекрашивает ее
let freezing = function(state){
    //проверяем - если падающая фигура в замороженном состоянии - то отобразить это
    if(state.figure_down.isFreeze){
        for (let i = 0; i < state.field.length; i++) {
            for (let j = 0; j < state.field[0].length; j++) {
                if(state.field[i][j] == 1){
                    state.field[i][j] = 2
                }
            }
        }
        state.isFreeze = false
        state.print_figure_in_field()
    }
}

class Game{
    constructor(width,height){
        this.width = width
        this.height = height
        this.field = []
        this.figure_down = null
        this.isPause = true
        this.intervalId = null
        this.score = 0;
    }

    print_cell(){//рисуем поле на основе массива поля
        for (let i = 0; i < this.field.length; i++) {
            const row = document.createElement('div');
            row.classList.add('row');
            for (let j = 0; j < this.field[0].length; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                row.appendChild(cell);
            } 
            let wrapper = document.getElementById('wrapper')
            wrapper.appendChild(row)
        }
        scoreDOM.innerHTML = `Счёт: ${game.score}`;//рисуем счет
    }

    init_field(){//инициализируем массив поля
        let array = new Array(this.height);
        for (let i = 0; i < array.length; i++) {
            array[i] = new Array(this.width);
        }
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array[0].length; j++) {
                array[i][j] = 0
            } 
        }
        this.field = array
    }

    add_figure_down(figure){//изменяем поле - добавляем падающую фигуру в массив
        this.chek_full_line()//проверяем на заполненность строки фигурами
        this.figure_down = figure
        for (let i = 0; i < this.figure_down.array.length; i++) {
            for (let j = 0; j < this.figure_down.array[0].length; j++) {
                this.field[i][j+Math.ceil(this.width/2)-Math.ceil(this.figure_down.array.length/2)] = this.figure_down.array[i][j]//j - манипуляции для отцентровки фигуры при создании вначале
            }
        }
        this.print_figure_in_field()
    }

    print_figure_in_field(){//открасим новый массив (с фигурой)
        let dom_rows = document.getElementsByClassName('row')//с помощью рядов можно отыскать позицию дом элемента для массива
        for (let i = 0; i < this.field.length; i++) {
            for (let j = 0; j < this.field[0].length; j++) {

                //если в массиве нули - открасим в поле их дом элементы серым
                if(this.field[i][j] == 0){//все ячейки которым соответствует элемент массива равный 0 - будут открашены в серый
                    dom_rows[i].childNodes[j].style.backgroundColor = '#cac8c656'
                }
                //если в массиве единички - открасим в поле их дом элементы 
                if(this.field[i][j] == 1){//все ячейки которым соответствует элемент массива равный 1 - будут открашены в красный
                    dom_rows[i].childNodes[j].style.backgroundColor = this.figure_down.color
                }
                //если в массиве двойки - открасим в поле их дом элементы 
                if(this.field[i][j] == 2){//все ячейки которым соответствует элемент массива равный 1 - будут открашены в красный
                    dom_rows[i].childNodes[j].style.backgroundColor = '#9370DB'//цвет для замороженых фигур (2)
                }
            }
        }
        scoreDOM.innerHTML = `Счёт: ${game.score}`;//отображаем и обновляем счет
    }

    chek_full_line(){//проверяем линию на заполненность
        for (let i = this.field.length-1; i >= 0; i--) {
            let count = 0;//для каждой строки делаем свой счетчик
            for (let j = 0; j < this.field[0].length; j++) {
                if(this.field[i][j] == 2){//если элемент в строке ==2 то счетчик увеличить на 1
                    count++
                }
                if(count == this.field[i].length){//если счетчик равен длине строки - то строку удалить и передвинуть все вышестроящее вниз на 1 итерацию
                    // i - номер строки, ячейки которой все заполнены фигурами - ее нужно удалить

                    this.score++;

                    //удаляем всю заполненную строку
                    for (let k = 0; k < this.field[0].length; k++) {//удаляем всю заполненную строку
                        this.field[i][k] = 0
                    }
                    
                    //все элементы = 2 нужно переместить на 1 итерацию вниз
                    for (let p = i; p >= 0; p--) {
                        for (let q = this.field[0].length-1; q >= 0; q--) {
                            if(this.field[p][q] == 2){//если элемент = 2 
                                this.field[p][q] = 0;//предыдущее место удалить 
                                this.field[p+1][q] = 2;//смещаем вниз на 1 строку
                            }
                        }
                    }
                }
            }
        }
    }

    move_figure_field_down(){//двигаем фигуру в массиве вниз

        if(!this.figure_down){//если фигуры нет - то и нечего тут шляться
            return
        }

        this.chek_full_line()
        
        //если снизу нет клеток - то заморозить фигуру
        for (let i = 0; i < this.field.length; i++) {
            for (let j = 0; j < this.field[0].length; j++) {
                 if (this.field[i][j] === 1) {
                    //тут условие заморозки для падающей фигуры и на границу поля и на фигуры 2ки
                    if (this.field[i + 1] === undefined || this.field[i+1][j] === undefined  && this.field[i+1][j] !=0 || this.field[i+1][j] == 2) {
                        console.log('нижняя граница');
                        this.figure_down.isFreeze = true;//заморозили фигуру
                        freezing(this)//заморозили фигуру
                        this.figure_down = null//удалили движущуюся фигуру из состояния
                        //return;
                     }
                }
            }
        }

        for (let i = this.field.length-1; i >= 0; i--) {
            for (let j = 0; j < this.field[0].length; j++) {
                if(this.field[i][j] == 1){
                    this.field[i][j] = 0;
                    this.field[i+1][j] = 1;
                }
            }
        }
        this.print_figure_in_field()//открашиваем фигуру в поле
    }

    move_figure_field_left(){//двигаем фигуру в массиве влево

        //если слева нет клеток - то ничего не делать
        for (let i =0; i <this.field.length; i++) {
            for (let j = 0; j < this.field[0].length; j++) {
                if((this.field[i][j] == 1) && (!this.field[i][j-1]) && (this.field[i][j-1] != 0)){
                    console.log('слева граница')
                    return
                }
            }
        }

        //слева фигура - в лево не двигать
        for (let i = this.field.length-1; i >= 0; i--) {
            for (let j = 0; j < this.field[0].length; j++) {
                if((this.field[i][j] == 1) && (this.field[i][j-1] == 2)){
                    console.log('слева фигура')
                    return
                }
            }
        }
        
        //двигаем фигуру влево
        for (let i = this.field.length-1; i >= 0; i--) {
            for (let j = 0; j < this.field[0].length; j++) {
                if(this.field[i][j] == 1){
                    //двигаем фигуру вниз
                    this.field[i][j] = 0;
                    this.field[i][j-1] = 1;
                }
            }
        }
        this.print_figure_in_field()//открашиваем фигуру в поле
    }

    move_figure_field_right(){//двигаем фигуру в массиве вправо

        //если справа нет клеток - то ничего не делать
        for (let i = this.field.length-1; i >= 0; i--) {
            for (let j = this.field[0].length; j >= 0; j--) {
                if((this.field[i][j] == 1) && (!this.field[i][j+1]) && (this.field[i][j+1] != 0)){
                    console.log('граница справа')
                    return
                }
            }
        }

        //если справа фигура - не двигать вправо
        for (let i = this.field.length-1; i >= 0; i--) {
            for (let j = this.field[0].length; j >= 0; j--) {
                if((this.field[i][j] == 1) && (this.field[i][j+1] == 2)){
                    console.log('справа фигура')
                    return
                }
            }
        }

        //двигаем фигуру вправо
        for (let i = this.field.length-1; i >= 0; i--) {
            for (let j = this.field[0].length; j >= 0; j--) {
                if(this.field[i][j] == 1){
                    this.field[i][j] = 0;
                    this.field[i][j+1] = 1;
                }
            }
        }
        this.print_figure_in_field()//открашиваем фигуру в поле
    }

    move_figure_field_rotate(){//вращаем фигуру в поле
        //если нечего крутить - выйти
        if(!this.figure_down){
            return
        }
        //Если фигура L 
        if(this.figure_down.type == 'L'){
            for (let i =0; i <this.field.length; i++) {
                for (let j = 0; j < this.field[0].length; j++) {
                   if(this.field[i][j] == 1){
                    if(this.figure_down.position == 'horizontal_bottom' && this.field[i+2] == undefined){return}//если фигура лежит и внизу - край поля - то ничего не делать - перевернуть не удасться
                    if(this.figure_down.position == 'horizontal_up' && this.field[i+2] == undefined){return}//если фигура лежит и внизу - край поля - то ничего не делать - перевернуть не удасться
                    if((this.field[i+1][j] == 1) && (this.field[i+2][j] == 1) && (this.field[i+2][j+1] == 1)){//если фигура в вертикальном положении и она смотрит вправо
        
                        this.figure_down.position = 'vertical_right'//то запомнить ее положение
                        let i_figure_in_field = i;//индекс верхнего слева квадрата
                        let j_figure_in_field = j;//индекс верхнего слева квадрата

                        if((this.field[i][j+2] === undefined) || (this.field[i][j+2] == 2) || (this.field[i][j+1] == 2)){//если справа граница поля или замороженная фигура 2
                         return//выйти из цикла
                        }

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'horizontal_bottom'//то запомнить ее положение
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }
                    if((this.field[i][j+1] == 1) && (this.field[i][j+2] == 1) && (this.field[i+1][j] == 1) ){//если фигура в горизонтальном положении и она смотрит вниз

                        this.figure_down.position = 'horizontal_bottom'//то запомнить ее положение
                        let i_figure_in_field = i;//индекс верхнего слева квадрата
                        let j_figure_in_field = j;//индекс верхнего слева квадрата

                        if((this.field[i+1][j+2] == 2) || (this.field[i+2][j+2] == 2)){//если справа замороженная фигура 2 или снизу граница поля
                         return//выйти из цикла
                        }

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'vertical_left'//то запомнить ее положение
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }
                    if((this.field[i][j+1] == 1) && (this.field[i+1][j+1] == 1) && (this.field[i+2][j+1] == 1)){//если фигура в горизонтальном положении и она смотрит вниз
                        this.figure_down.position = 'vertical_left'//то запомнить ее положение
                        let i_figure_in_field = i;//индекс верхнего слева квадрата
                        let j_figure_in_field = j-1;//индекс верхнего слева квадрата (ИЗМЕНЕНИЕ)

                        if((this.field[i+2][j] == 2) || (this.field[i+2][j-1] == 2)){//если слева замороженная фигура 2
                            return//выйти из цикла
                        }

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'horizontal_up'//то запомнить ее положение
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }
                    if((this.field[i+1][j] == 1) && (this.field[i+1][j-1] == 1) && (this.field[i+1][j-2] == 1)){//если фигура в горизонтальном положении и она смотрит вниз
                        this.figure_down.position = 'horizontal_up'//то запомнить ее положение
                        let i_figure_in_field = i-1;//индекс верхнего слева квадрата (ИЗМЕНЕНИЕ)
                        let j_figure_in_field = j-2;//индекс верхнего слева квадрата (ИЗМЕНЕНИЕ)

                        if((this.field[i-1][j-2] == 2) || (this.field[i][j-2] == 2)){//если слева замороженная фигура 2
                            return//выйти из цикла
                        }

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'vertical_right'//то запомнить ее положение
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }
                   } 
                }
            }
        }
        //Фигура Z
        if(this.figure_down.type == 'Z'){
            for (let i =0; i <this.field.length; i++) {
                for (let j = 0; j < this.field[0].length; j++) {
                   if(this.field[i][j] == 1){
                    if(this.figure_down.position == 'horizontal_bottom' && this.field[i+2] == undefined){return}//если фигура лежит и внизу - край поля - то ничего не делать - перевернуть не удасться
                    if((this.field[i+1][j] == 1) && (this.field[i+1][j+1] == 1) && (this.field[i+2][j+1] == 1) && (this.figure_down.position == 'vertical_right')){//если фигура в вертикальном положении и она смотрит вправо
        
                        let i_figure_in_field = i;//индекс верхнего слева квадрата
                        let j_figure_in_field = j;//индекс верхнего слева квадрата

                        if((this.field[i][j+2] === undefined) || (this.field[i][j+1] == 2) || (this.field[i][j+2] == 2)){//если справа граница поля или замороженная фигура 2
                         return//выйти из цикла
                        }

                        if((this.field[i+2][j] == 2)){//если слева внизу замороженная фигура 2
                            return//выйти из цикла
                        }

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'horizontal_bottom'
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }
                    if((this.field[i][j+1] == 1) && (this.field[i+1][j-1] == 1) && (this.field[i+1][j] == 1) && (this.figure_down.position == 'horizontal_bottom')){//если фигура в горизонтальном положении и она смотрит вниз
                        
                        let i_figure_in_field = i;//индекс верхнего слева квадрата
                        let j_figure_in_field = j-1;//индекс верхнего слева квадрата

                        if((this.field[i+1][j+1] == 2) || (this.field[i+2][j+1] == 2) || (this.field[i][j-1] == 2)){//если справа замороженная фигура 2
                            return//выйти из цикла
                        }

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'vertical_left'
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }
                    if((this.field[i+1][j] == 1) && (this.field[i+1][j+1] == 1) && (this.field[i+2][j+1] == 1) &&(this.figure_down.position == 'vertical_left')){//если фигура в горизонтальном положении и она смотрит вниз

                        let i_figure_in_field = i;//индекс верхнего слева квадрата
                        let j_figure_in_field = j-1;//индекс верхнего слева квадрата (ИЗМЕНЕНИЕ)

                        if((this.field[i+2][j] == 2) || (this.field[i+2][j-1] == 2) || (this.field[i][j+1] == 2)){//если слева замороженная фигура 2
                            return//выйти из цикла
                        }

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'horizontal_up'
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }
                    if((this.field[i][j+1] == 1) && (this.field[i+1][j] == 1) && (this.field[i+1][j-1] == 1) && (this.figure_down.position == 'horizontal_up')){//если фигура в горизонтальном положении и она смотрит вниз

                        let i_figure_in_field = i-1;//индекс верхнего слева квадрата (ИЗМЕНЕНИЕ)
                        let j_figure_in_field = j-1;//индекс верхнего слева квадрата (ИЗМЕНЕНИЕ)

                        if((this.field[i-1][j-1] == 2) || (this.field[i][j-1] == 2) || (this.field[i+1][j+1] == 2)){//если слева замороженная фигура 2
                            return//выйти из цикла
                        }

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'vertical_right'
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }else{
                        //незнаю из за чего , но почему то после заморозки и обновления состояния падающей фигуры - ее позиция как то сохраняется , пришлось сделать такой костыль который смирился что где то состояние старое сохранилось : тупо в доп условии по умолчанию позиция - изначальная райт лефт и нажал 1 раз на поворот - т.к требует сделать двойное нажатие тоже хз почему так
                        this.figure_down.position = 'vertical_right'
                        this.move_figure_field_rotate()
                        return
                    }
                   } 
                }
            }
        }
        //Фигура T
        if(this.figure_down.type == 'T'){
            for (let i =0; i <this.field.length; i++) {
                for (let j = 0; j < this.field[0].length; j++) {
                   if(this.field[i][j] == 1){

                    if(this.figure_down.position == 'horizontal_bottom' && this.field[i+2] == undefined){
                        return
                    }//если фигура лежит и внизу - край поля - то ничего не делать - перевернуть не удасться

                    //это дополнительное 5ое условие: если T лежит на спине и на границе поля внизу
                    if((this.figure_down.position == 'horizontal_up') && this.field[i+2] == undefined){//если фигура в горизонтальном положении и она смотрит вниз

                        let i_figure_in_field = i-1;//индекс верхнего слева квадрата (ИЗМЕНЕНИЕ)
                        let j_figure_in_field = j-1;//индекс верхнего слева квадрата (ИЗМЕНЕНИЕ)

                        if((this.field[i-1][j-1] == 2) || (this.field[i][j-1] == 2)){//если слева замороженная фигура 2
                            return//выйти из цикла
                        }

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'vertical_right'
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }

                    if((this.field[i+1][j] == 1) && (this.field[i+1][j+1] == 1) && (this.field[i+2][j] == 1) && (this.figure_down.position == 'vertical_right')){//если фигура в вертикальном положении и она смотрит вправо
        
                        let i_figure_in_field = i;//индекс верхнего слева квадрата
                        let j_figure_in_field = j;//индекс верхнего слева квадрата

                        if((this.field[i][j+2] === undefined) || (this.field[i][j+1] == 2) || (this.field[i][j+2] == 2)){//если справа граница поля или замороженная фигура 2
                         return//выйти из цикла
                        }

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'horizontal_bottom'
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }
                    if((this.field[i][j+1] == 1) && (this.field[i][j+2] == 1) && (this.field[i+1][j+1] == 1) && (this.figure_down.position == 'horizontal_bottom')){//если фигура в горизонтальном положении и она смотрит вниз
                        
                        let i_figure_in_field = i;//индекс верхнего слева квадрата
                        let j_figure_in_field = j;//индекс верхнего слева квадрата

                        if((this.field[i+1][j+2] == 2) || (this.field[i+2][j+2] == 2)){//если справа замороженная фигура 2
                            return//выйти из цикла
                        }

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'vertical_left'
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }
                    if((this.field[i+1][j] == 1) && (this.field[i+2][j] == 1) && (this.field[i+1][j-1] == 1) &&(this.figure_down.position == 'vertical_left')){//если фигура в горизонтальном положении и она смотрит вниз

                        let i_figure_in_field = i;//индекс верхнего слева квадрата
                        let j_figure_in_field = j-2;//индекс верхнего слева квадрата (ИЗМЕНЕНИЕ)

                        if((this.field[i][j-2] === undefined) || (this.field[i+2][j-1] == 2) || (this.field[i+2][j-2] == 2)){//если справа граница поля или замороженная фигура 2
                            return//выйти из цикла
                           }

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'horizontal_up'
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }
                    if((this.field[i+1][j-1] == 1) && (this.field[i+1][j] == 1) && (this.field[i+1][j+1] == 1) && (this.figure_down.position == 'horizontal_up')){//если фигура в горизонтальном положении и она смотрит вниз

                        let i_figure_in_field = i-1;//индекс верхнего слева квадрата (ИЗМЕНЕНИЕ)
                        let j_figure_in_field = j-1;//индекс верхнего слева квадрата (ИЗМЕНЕНИЕ)

                        if((this.field[i-1][j-1] == 2) || (this.field[i][j-1] == 2)){//если слева замороженная фигура 2
                            return//выйти из цикла
                        }

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'vertical_right'
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }else{
                        //незнаю из за чего , но почему то после заморозки и обновления состояния падающей фигуры - ее позиция как то сохраняется , пришлось сделать такой костыль который смирился что где то состояние старое сохранилось : тупо в доп условии по умолчанию позиция - изначальная райт лефт и нажал 1 раз на поворот - т.к требует сделать двойное нажатие тоже хз почему так
                        this.figure_down.position = 'vertical_right'
                        this.move_figure_field_rotate()
                        return
                    }
                   } 
                }
            }
        }
        if(this.figure_down.type == 'O'){
            return
        }
        //Фигура I
        if(this.figure_down.type == 'I'){
            for (let i =0; i <this.field.length; i++) {
                for (let j = 0; j < this.field[0].length; j++) {
                   if(this.field[i][j] == 1){
                    if((this.field[i+1][j] == 1) && (this.field[i+2][j] == 1) && (this.field[i+3][j] == 1) && (this.figure_down.position == 'vertical_right')){//если фигура в вертикальном положении и она смотрит вправо
        
                        let i_figure_in_field = i;//индекс верхнего слева квадрата
                        let j_figure_in_field = j-1;//индекс верхнего слева квадрата

                        if((this.field[i][j+1] === undefined) || (this.field[i][j+2] == undefined) || (this.field[i][j-1] == undefined) || (this.field[i+1][j+1] == 2) || (this.field[i+1][j+2] == 2)){//если справа граница поля или замороженная фигура 2
                         return//выйти из цикла
                        }

                        if(//условие для 2 которые входят в область поворота и мешают ему
                            this.field[i][j-1] == 2 || 
                            this.field[i+1][j-1] == 2 || 
                            this.field[i+2][j-1] == 2 || 
                            this.field[i+3][j-1] == 2 || 
                            this.field[i][j+1] == 2 || 
                            this.field[i][j+2] == 2
                        ){return}

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'horizontal_bottom'
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }
                    if((this.field[i][j+1] == 1) && (this.field[i][j+2] == 1) && (this.field[i][j+3] == 1) && (this.figure_down.position == 'horizontal_bottom')){//если фигура в горизонтальном положении и она смотрит вниз
                        
                        let i_figure_in_field = i-1;//индекс верхнего слева квадрата
                        let j_figure_in_field = j;//индекс верхнего слева квадрата

                        if( (this.field[i+1] == undefined) || (this.field[i+2] == undefined) || (this.field[i+1][j+2] == 2) || (this.field[i+2][j+2] == 2)){//если справа внизу фигура 2 или граница поля
                            return//выйти из цикла
                        }

                        if(//условие для 2 которые входят в область поворота и мешают ему
                            this.field[i-1][j] == 2 || 
                            this.field[i-1][j+1] == 2 || 
                            this.field[i-1][j+2] == 2 || 
                            this.field[i-1][j+3] == 2 || 
                            this.field[i+1][j+3] == 2 || 
                            this.field[i+2][j+3] == 2
                        ){return}

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'vertical_left'
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }
                    if((this.field[i+1][j] == 1) && (this.field[i+2][j] == 1) && (this.field[i+3][j] == 1) &&(this.figure_down.position == 'vertical_left')){//если фигура в горизонтальном положении и она смотрит вниз

                        let i_figure_in_field = i;//индекс верхнего слева квадрата
                        let j_figure_in_field = j-2;//индекс верхнего слева квадрата (ИЗМЕНЕНИЕ)

                        if((this.field[i+2][j-1] == 2) || (this.field[i+2][j-2] == 2) || (this.field[i+2][j-2] == undefined) || (this.field[i+2][j-1] == undefined) || (this.field[i][j+1] == undefined) || (this.field[i+2][j+2] == undefined)){//если слева замороженная фигура 2 или граница поля
                            return//выйти из цикла
                        }

                        if(//условие для 2 которые входят в область поворота и мешают ему
                            this.field[i][j+1] == 2 || 
                            this.field[i+1][j+1] == 2 || 
                            this.field[i+2][j+1] == 2 || 
                            this.field[i+3][j+1] == 2 || 
                            this.field[i+3][j-1] == 2 || 
                            this.field[i+3][j-2] == 2
                        ){return}

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'horizontal_up'
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }
                    if((this.field[i][j+1] == 1) && (this.field[i][j+2] == 1) && (this.field[i][j+3] == 1) && (this.figure_down.position == 'horizontal_up')){//если фигура в горизонтальном положении и она смотрит вниз

                        let i_figure_in_field = i-2;//индекс верхнего слева квадрата (ИЗМЕНЕНИЕ)
                        let j_figure_in_field = j;//индекс верхнего слева квадрата (ИЗМЕНЕНИЕ)

                        if((this.field[i-1][j+1] == 2) || (this.field[i-2][j-1] == 2)){//если сверху замороженная фигура 2
                            return//выйти из цикла
                        }

                        if(//условие для 2 которые входят в область поворота и мешают ему
                            this.field[i+1][j] == 2 || 
                            this.field[i+1][j+1] == 2 || 
                            this.field[i+1][j+2] == 2 || 
                            this.field[i+1][j+3] == 2 || 
                            this.field[i-1][j] == 2 || 
                            this.field[i-2][j] == 2
                        ){return}

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'vertical_right'
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }else{
                        //незнаю из за чего , но почему то после заморозки и обновления состояния падающей фигуры - ее позиция как то сохраняется , пришлось сделать такой костыль который смирился что где то состояние старое сохранилось : тупо в доп условии по умолчанию позиция - изначальная райт лефт и нажал 1 раз на поворот - т.к требует сделать двойное нажатие тоже хз почему так
                        this.figure_down.position = 'vertical_right'
                        this.move_figure_field_rotate()
                        return
                    }
                   } 
                }
            }
        }
        //Фигура J
        if(this.figure_down.type == 'J'){
            for (let i =0; i <this.field.length; i++) {
                for (let j = 0; j < this.field[0].length; j++) {
                   if(this.field[i][j] == 1){
                    if((this.field[i+1][j] == 1) && (this.field[i+2][j] == 1) && (this.field[i+2][j-1] == 1)){//если фигура в вертикальном положении и она смотрит вправо
        
                        this.figure_down.position = 'vertical_right'//то запомнить ее положение
                        let i_figure_in_field = i;//индекс верхнего слева квадрата
                        let j_figure_in_field = j-1;//индекс верхнего слева квадрата

                        if((this.field[i][j+1] == undefined)){//если справа граница поля 
                         return//выйти из цикла
                        }

                        if(//условие для 2 которые входят в область поворота и мешают ему
                            this.field[i][j-1] == 2 || 
                            this.field[i][j+1] == 2 || 
                            this.field[i+1][j-1] == 2 || 
                            this.field[i+1][j+1] == 2
                        ){return}

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'horizontal_bottom'//то запомнить ее положение
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }
                    if((this.field[i+1][j] == 1) && (this.field[i+1][j+1] == 1) && (this.field[i+1][j+2] == 1) ){//если фигура в горизонтальном положении и она смотрит вниз

                        this.figure_down.position = 'horizontal_bottom'//то запомнить ее положение
                        let i_figure_in_field = i;//индекс верхнего слева квадрата
                        let j_figure_in_field = j;//индекс верхнего слева квадрата

                        if((this.field[i+2] == undefined)){//если внизу граница поля
                         return//выйти из цикла
                        }

                        if(//условие для 2 которые входят в область поворота и мешают ему
                            this.field[i][j+1] == 2 ||
                            this.field[i][j+2] == 2 ||
                            this.field[i+2][j+1] == 2 ||
                            this.field[i+2][j+2] == 2
                        ){return}

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'vertical_left'//то запомнить ее положение
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }
                    if((this.field[i+1][j] == 1) && (this.field[i+2][j] == 1) && (this.field[i][j+1] == 1)){//если фигура в горизонтальном положении и она смотрит вниз
                        this.figure_down.position = 'vertical_left'//то запомнить ее положение
                        let i_figure_in_field = i;//индекс верхнего слева квадрата
                        let j_figure_in_field = j-1;//индекс верхнего слева квадрата (ИЗМЕНЕНИЕ)

                        if(this.field[i][j-1] == undefined){//если слева край поля
                            return//выйти из цикла
                        }

                        if(//условие для 2 которые входят в область поворота и мешают ему
                            this.field[i+1][j+1] == 2 ||
                            this.field[i+1][j-1] == 2 ||
                            this.field[i+2][j+1] == 2 ||
                            this.field[i+2][j-1] == 2
                        ){return}

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'horizontal_up'//то запомнить ее положение
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }
                    if((this.field[i][j+1] == 1) && (this.field[i][j+2] == 1) && (this.field[i+1][j+2] == 1)){//если фигура в горизонтальном положении и она смотрит вниз
                        this.figure_down.position = 'horizontal_up'//то запомнить ее положение
                        let i_figure_in_field = i-1;//индекс верхнего слева квадрата (ИЗМЕНЕНИЕ)
                        let j_figure_in_field = j;//индекс верхнего слева квадрата (ИЗМЕНЕНИЕ)

                        if(this.field[i+2] == undefined){//если снизу край поля
                            return//выйти из цикла
                        }

                        if(//условие для 2 которые входят в область поворота и мешают ему
                            this.field[i-1][j] == 2 ||
                            this.field[i-1][j+1] == 2 ||
                            this.field[i+1][j] == 2 ||
                            this.field[i+1][j+1] == 2
                        ){return}

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'vertical_right'//то запомнить ее положение
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }
                   } 
                }
            }
        }
        //Фигура S
        if(this.figure_down.type == 'S'){
            for (let i =0; i <this.field.length; i++) {
                for (let j = 0; j < this.field[0].length; j++) {
                   if(this.field[i][j] == 1){
                    //if(this.figure_down.position == 'horizontal_bottom' && this.field[i+2] == undefined){return}//если фигура лежит и внизу - край поля - то ничего не делать - перевернуть не удасться
                    if((this.field[i+1][j] == 1) && (this.field[i+1][j-1] == 1) && (this.field[i+2][j-1] == 1) && (this.figure_down.position == 'vertical_right')){//если фигура в вертикальном положении и она смотрит вправо
        
                        let i_figure_in_field = i;//индекс верхнего слева квадрата
                        let j_figure_in_field = j-1;//индекс верхнего слева квадрата

                        if((this.field[i][j+1] === undefined)){//если справа граница поля или замороженная фигура 2
                         return//выйти из цикла
                        }

                        if(//условие для 2 которые входят в область поворота и мешают ему
                            this.field[i][j-1] == 2 ||
                            this.field[i][j+1] == 2 ||
                            this.field[i+1][j+1] == 2
                        ){return}

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'horizontal_bottom'
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }
                    if((this.field[i][j+1] == 1) && (this.field[i+1][j+1] == 1) && (this.field[i+1][j+2] == 1) && (this.figure_down.position == 'horizontal_bottom')){//если фигура в горизонтальном положении и она смотрит вниз
                        
                        let i_figure_in_field = i;//индекс верхнего слева квадрата
                        let j_figure_in_field = j;//индекс верхнего слева квадрата

                        if((this.field[i+2] == undefined)){//если снизу грань
                            return//выйти из цикла
                        }

                        if(//условие для 2 которые входят в область поворота и мешают ему
                            this.field[i][j+2] == 2 ||
                            this.field[i+2][j+1] == 2 ||
                            this.field[i+2][j+2] == 2
                        ){return}

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'vertical_left'
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }
                    if((this.field[i+1][j] == 1) && (this.field[i+1][j-1] == 1) && (this.field[i+2][j-1] == 1) &&(this.figure_down.position == 'vertical_left')){//если фигура в горизонтальном положении и она смотрит вниз

                        let i_figure_in_field = i;//индекс верхнего слева квадрата
                        let j_figure_in_field = j-2;//индекс верхнего слева квадрата (ИЗМЕНЕНИЕ)

                        if((this.field[i][j-2] == undefined)){//если слева замороженная фигура 2
                            return//выйти из цикла
                        }

                        if(//условие для 2 которые входят в область поворота и мешают ему
                            this.field[i+2][j] == 2 ||
                            this.field[i+2][j-2] == 2 ||
                            this.field[i+1][j-2] == 2
                        ){return}

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'horizontal_up'
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }
                    if((this.field[i][j+1] == 1) && (this.field[i+1][j+1] == 1) && (this.field[i+1][j+2] == 1) && (this.figure_down.position == 'horizontal_up')){//если фигура в горизонтальном положении и она смотрит вниз

                        let i_figure_in_field = i-1;//индекс верхнего слева квадрата (ИЗМЕНЕНИЕ)
                        let j_figure_in_field = j;//индекс верхнего слева квадрата (ИЗМЕНЕНИЕ)

                        if((this.field[i-1] == undefined)){//если слева замороженная фигура 2
                            return//выйти из цикла
                        }

                        if(//условие для 2 которые входят в область поворота и мешают ему
                            this.field[i-1][j] == 2 ||
                            this.field[i-1][j+1] == 2 ||
                            this.field[i+1][j] == 2
                        ){return}

                        //создаем пустой массив для хранения перевернутого массива
                        let rotated = Array(this.height).fill(0).map(() => Array(this.width).fill(0));
                        //перезаписываем все поле с замороженными фигурами в новый (сохраняем состояние историю)
                        for (let i =0; i <this.field.length; i++) {
                            for (let j = 0; j < this.field[0].length; j++) {
                                if(this.field[i][j] == 2){
                                    rotated[i][j] = this.field[i][j]
                                }
                            }
                            
                        }

                        let ceils_in_range_rotate = []//////тут мы сохранили координаты наших замороженных клеток , которые попали в область поворота
                            
                        //поворачиваем фигуру
                        for (let k =i_figure_in_field; k < i_figure_in_field+this.figure_down.size; k++) {
                            for (let p = j_figure_in_field; p < j_figure_in_field+this.figure_down.size; p++) {
                                if(this.field[k][p] == 2){//////если вдруг в области которую мы захотим поворачивать найдутся клетки замороженных фигур , то сначала запомним их координаты , затем заменим их на 0 , повернем движущуюся фигуру , а потом отрисуем их заново 
                                    ceils_in_range_rotate.push([k,p])
                                    this.field[k][p] = 0;//заменяем замороженые фигуры в области поворота на 0 
                                }
                                //индексы k и p - координаты фигуры внутри поля которую необходимо повернуть
                                rotated[i_figure_in_field+(p-j_figure_in_field)][j_figure_in_field+this.figure_down.size-1-(k-i_figure_in_field)] = this.field[k][p]
                            }
                        }

                        this.figure_down.position = 'vertical_right'
                        this.field = rotated//обновляем поле
                        this.field = applyIndexes(this.field,ceils_in_range_rotate,2)//функция которая помнит какие замороженные клетки попадали в область поворота , берет координаты из массива ceils_in_range_rotate и обратно меняет 0 на 2
                        this.print_figure_in_field()//открашиваем поле
                        return//выходим из цикла
                    }else{
                        //незнаю из за чего , но почему то после заморозки и обновления состояния падающей фигуры - ее позиция как то сохраняется , пришлось сделать такой костыль который смирился что где то состояние старое сохранилось : тупо в доп условии по умолчанию позиция - изначальная райт лефт и нажал 1 раз на поворот - т.к требует сделать двойное нажатие тоже хз почему так
                        this.figure_down.position = 'vertical_right'
                        this.move_figure_field_rotate()
                        return
                    }
                   } 
                }
            }
        }
    }

    start(){

        if(!this.isPause){//если игра не на паузе то не нужно запускать еще раз старт
            return
        }

        this.isPause = false//снимаем с паузы

        this.intervalId = setInterval(()=>{
            if(!this.figure_down){
                this.add_figure_down(randomFigure(array_figures))
            }
            if(this.figure_down){
                this.move_figure_field_down()
            }
        },800)
    }

    stop(){
        this.isPause = true
        clearInterval(this.intervalId)
    }
}

game = new Game(16,26)
game.init_field()
game.print_cell()

//исключаем нажатие на кнопку старт и стоп при нажатии на пробелл
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 32) {
      event.preventDefault();
    }
  });

document.addEventListener('keydown',function(event){
    let button = event.code
    switch (button) {
        case 'ArrowDown':
            game.move_figure_field_down()
            break;
        case 'ArrowLeft':
            game.move_figure_field_left()
            break;
        case 'ArrowRight':
            game.move_figure_field_right()
            break;
        case 'Space':
            game.move_figure_field_rotate()
            break;
        default:
            break;
    }
})

let start_botton = document.getElementById('start')
let stop_botton = document.getElementById('stop')

start_botton.addEventListener('click', ()=>{game.start()})
stop_botton.addEventListener('click',()=>{game.stop()})













