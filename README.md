Ссылка на работу тетриса -> https://mynameiswesker.github.io/tetris/

Идея, механика, код - все придумывалось и обдумывалось самостоятельно.
В итоге нашел несколько недочетов и стал лучше понимать как именно работает тетрис:
  1) Цвет фигур можно было бы сохранить после заморозки , используя в качестве данных массива объекты с CSS-цветами, а не 
      нули и единички как сделал я. С другой стороны я хотел увидеть что заморозка фигур происходит, а без изменения цвета
      это увидеть было бы проблематично, поэтому все было по задумке.
  2) Описав поворот на 90 градусов для одной фигуры , я повторил это для остальных (crt C + ctr V), дописав соответствующий функционал , 
      который различается для каждой фигуры . Не стал делать фабричную функцию , из за этого строчек кода стало много, 
       но время было жалко, т.к. есть и основная работа. Плюс хотелось побыстрее увидеть результат =).
