import React from "react";
import Chip from "./Chip";
import ChipComponent from "./ChipComponent";
var classNames = require("classnames");



const NUMBERS_1_12 = 'NUMBERS_1_12';
const NUMBERS_2_12 = 'NUMBERS_2_12';
const NUMBERS_3_12 = 'NUMBERS_3_12';
const NUMBERS_1_18 = 'NUMBERS_1_18';
const NUMBERS_19_36 = 'NUMBERS_19_36';
const EVEN = 'EVEN';
const ODD = 'ODD';
const RED = 'RED';
const BLACK = 'BLACK';
const EMPTY = 'EMPTY';
const NUMBER = 'NUMBER';
const TRIPLE_SPLIT = 'TRIPLE_SPLIT';
const DOUBLE_SPLIT = 'DOUBLE_SPLIT';
const QUAD_SPLIT = 'QUAD_SPLIT';

class Board extends React.Component {
  numbers;
  other_1_12 = { type: NUMBERS_1_12 } ;
  other_2_12 = { type: NUMBERS_2_12 } ;
  other_3_12 = { type: NUMBERS_3_12 } ;
  other_1_18 = { type: NUMBERS_1_18 } ;
  other_19_36 = { type: NUMBERS_19_36 } ;
  other_even = { type: EVEN } ;
  other_odd = { type: ODD } ;
  other_red = { type: RED } ;
  other_black = { type: BLACK } ;
  totalNumbers = 37;
  rouletteWheenNumbers;

  constructor(props) {
    super(props);
    this.onCellClick = this.onCellClick.bind(this);

    this.numbers = this.getNumbersList();
    this.rouletteWheenNumbers = [ 
      0, 32, 15, 19, 4, 21, 2, 25,
      17, 34, 6, 27, 13, 36, 11,
      30, 8, 23,10, 5, 24, 16, 33,
      1, 20, 14, 31, 9, 22, 18, 29,
      7, 28, 12, 35, 3, 26
  ];
  }

  getRouletteColor = (number) => {
    var index = this.rouletteWheenNumbers.indexOf(number);
    const i =
      index >= 0
        ? index % this.totalNumbers
        : this.totalNumbers - Math.abs(index % this.totalNumbers);
    return i == 0 || number == null ? "none" : i % 2 == 0 ? "black" : "red";
  };

  getCellItemFromCellItemType(type) {}
  getClassNamesFromCellItemType(type, number) {
    var isEvenOdd = 0;
    if (number != null && type === NUMBER && number !== 0) {
      if (number % 2 === 0) {
        isEvenOdd = 1;
      } else {
        isEvenOdd = 2;
      }
    }
    let numberValue = "value-" + number;
    var cellClass = classNames({
      //[`${numberValue}`]: true,
      "board-cell-number": type === NUMBER,
      "board-cell-double-split": type === DOUBLE_SPLIT,
      "board-cell-quad-split": type === QUAD_SPLIT,
      "board-cell-triple-split": type === TRIPLE_SPLIT,
      "board-cell-empty": type === EMPTY,
      "board-cell-even": type === EVEN || isEvenOdd === 1,
      "board-cell-odd": type === ODD || isEvenOdd === 2,
      "board-cell-number-1-18":
        type === NUMBERS_1_18 ||
        (number !== null && number >= 1 && number <= 18 && type === NUMBER),
      "board-cell-number-19-36":
        type === NUMBERS_19_36 ||
        (number !== null && number >= 19 && number <= 36 && type === NUMBER),
      "board-cell-number-1-12":
        type === NUMBERS_1_12 ||
        (number !== null && number % 3 === 0 && type === NUMBER && number !== 0),
      "board-cell-number-2-12":
        type === NUMBERS_2_12 ||
        (number !== null && number % 3 === 2 && type === NUMBER),
      "board-cell-number-3-12":
        type === NUMBERS_3_12 ||
        (number !== null && number % 3 === 1 && type === NUMBER),
      "board-cell-red":
        type === RED ||
        (number !== null && this.getRouletteColor(number) === "red" && type === NUMBER),
      "board-cell-black":
        type === BLACK ||
        (number !== null && this.getRouletteColor(number) === "black" && type === NUMBER)
    });

    return cellClass;
  }
  
  getNumbersList() {

    let colList = [];
    var difference = 3;

    for (let i = 1; i <= 5; i++) {
      let rowList = [];
      var startNumberSub = 0;
      if (i === 3) {
        startNumberSub = 1;
      } else if (i == 5) {
        startNumberSub = 2;
      }

      var nextStartNumberSub = 0;
      if (i + 1 === 3) {
        nextStartNumberSub = 1;
      } else if (i + 1 === 5) {
        nextStartNumberSub = 2;
      }
      var prevStartNumberSub = 0;
      if (i - 1 === 3) {
        prevStartNumberSub = 1;
      } else if (i - 1 === 5) {
        prevStartNumberSub = 2;
      }
      if (i === 1) {
        let cell = {} ;
        cell.type = NUMBER;
        cell.value = 0;

        rowList.push(cell);
      }
      for (let j = 1; j <= 26; j++) {
        let cell = {} ;

        if (j > 24) {
          cell.type = EMPTY;
          rowList.push(cell);
          continue;
        }
        // 2, 4 mid splits
        if (i % 2 === 0) {
          if (j === 1) {
            var leftNumber = 0;
            var topNumber = difference - prevStartNumberSub;
            var bottomNumber = difference - nextStartNumberSub;

            cell.type = TRIPLE_SPLIT;
            cell.valueSplit = [leftNumber, topNumber, bottomNumber];
            rowList.push(cell);
          } else {
            if (j % 2 === 0) {
              var topNumber =
                ((j - 2) / 2) * difference + difference - prevStartNumberSub;
              var bottomNumber =
                ((j - 2) / 2) * difference + difference - nextStartNumberSub;
              cell.type = DOUBLE_SPLIT;
              cell.valueSplit = [topNumber, bottomNumber];
              rowList.push(cell);
            } else {
              var leftNumber = ((j - 1) / 2) * difference - prevStartNumberSub;
              var rightNumber = leftNumber + difference;
              var bottomLeftNumber =
                ((j - 1) / 2) * difference - nextStartNumberSub;
              var bottomRightNumber = bottomLeftNumber + difference;
              cell.type = QUAD_SPLIT;
              cell.valueSplit = [
                leftNumber,
                rightNumber,
                bottomLeftNumber,
                bottomRightNumber
              ];
              rowList.push(cell);
            }
          }
        } else {
          // 1, 3, 5 normal rows
          if (j === 1) {
            var leftNumber = 0;
            var rightNumber = leftNumber + difference;
            cell.type = DOUBLE_SPLIT;
            cell.valueSplit = [leftNumber, rightNumber];
            rowList.push(cell);
          } else {
            if (j % 2 === 0) {
              var currentNumber =
                ((j - 2) / 2) * difference + difference - startNumberSub;
              cell.type = NUMBER;
              cell.value = currentNumber;
              rowList.push(cell);
            } else {
              var leftNumber = ((j - 1) / 2) * difference - startNumberSub;
              var rightNumber = leftNumber + difference;
              cell.type = DOUBLE_SPLIT;
              cell.valueSplit = [leftNumber, rightNumber];
              rowList.push(cell);
            }
          }
        }
      }
      colList.push(rowList);
    }
    
    return colList;
  }

  onCellClick = (item) => {
    this.props.onCellClick(item);
  };

  render() {
    let getValueByCell = (cell) => {
      var cells = Array.from(this.props.chipsData.placedChips.keys()).filter((el) => el.type == cell.type && el.value == cell.value)
      if (cells.length == 0)
        return
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')
      return this.props.chipsData.placedChips.get(cells[0])
    }
    console.log(this.props)
    var currentItemChips_1_12 = this.props.chipsData.placedChips.get(
      this.other_1_12
    );
    var currentItemChips_2_12 = this.props.chipsData.placedChips.get(
      this.other_2_12
    );
    var currentItemChips_3_12 = this.props.chipsData.placedChips.get(
      this.other_3_12
    );
    var currentItemChips_1_18 = this.props.chipsData.placedChips.get(
      this.other_1_18
    );
    var currentItemChips_even = getValueByCell(
      this.other_even
    );
    var currentItemChips_red = getValueByCell(
      this.other_red
    );
    var currentItemChips_black = this.props.chipsData.placedChips.get(
      this.other_black
    );
    var currentItemChips_odd = getValueByCell(
      this.other_odd
    );
    var currentItemChips_19_36 = this.props.chipsData.placedChips.get(
      this.other_19_36
    );

    return (
      <div className="roulette-board-wrapper hideElementsTest" style={{position: 'absolute', top: '450px', left: '600px'}}>
        <div className="roulette-board">
          <div className="roulette-board-grid-numbers">
            <table>
              <tbody>
                {this.numbers.map((item, index) => {
                  var keyId = 0;
                  return (
                    <tr key={"tr_board_" + index}>
                      {item.map((cell, cellIndex) => {
                        var cellClass = this.getClassNamesFromCellItemType(
                          cell.type,
                          cell.value
                        );
                        
                        if (
                          cell.type === NUMBER &&
                          cell.value === 0
                        ) {
                          var tdKey = "td_" + cell.type + "_" + cell.value;
                          var chipKey = "chip_" + cell.type + "_" + cell.value;

                          var currentItemChips = this.props.chipsData.placedChips.get(
                            cell
                          );
                          
                          return (
                            <ChipComponent
                              currentItemChips={currentItemChips}
                              tdKey={tdKey}
                              chipKey={chipKey}
                              cell={cell}
                              cellClass={cellClass}
                              rowSpan={5}
                              colSpan={1}
                              onCellClick={this.onCellClick} 
                              leftMin={undefined} 
                              leftMax={undefined} 
                              topMin={undefined} topMax={undefined}                            />
                          );
                        } else {
                          var chipKeyValue = cell.value + "";
                          if (cell.value === undefined) {
                            var split = cell.valueSplit + "";
                            chipKeyValue = "split_" + split;
                          }
                          var tdKey = "td_" + cell.type + "_" + chipKeyValue;
                          var chipKey =
                            "chip_" + cell.type + "_" + chipKeyValue;

                          if (cell.type === EMPTY) {
                            keyId++;
                            return (
                              <td
                                key={"empty_" + keyId}
                                className={cellClass}
                              ></td>
                            );
                          } else {
                            var currentItemChips = getValueByCell(
                              cell
                            );
                            if (currentItemChips) {
                              console.log(currentItemChips)
                              console.log(cell)
                            }
                            return (
                              <ChipComponent
                                currentItemChips={currentItemChips}
                                tdKey={tdKey}
                                chipKey={chipKey}
                                cell={cell}
                                rowSpan={1}
                                colSpan={1}
                                cellClass={cellClass}
                                onCellClick={this.onCellClick} leftMin={undefined} leftMax={undefined} topMin={undefined} topMax={undefined}                              />
                            );
                          }
                        }
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="roulette-board-grid-other">
            <table>
              <tbody>
                <tr>
                  <td colSpan={2}></td>


                  <ChipComponent
                    currentItemChips={currentItemChips_1_12}
                    tdKey={"td_other_1_12"}
                    chipKey={"chip_other_1_12"}
                    cell={this.other_1_12}
                    rowSpan={1}
                    colSpan={7}
                    cellClass={this.getClassNamesFromCellItemType(
                      NUMBERS_1_12,
                      null
                    )}
                    leftMin={70}
                    leftMax={140}
                    onCellClick={this.onCellClick} topMin={undefined} topMax={undefined}                  />


                  <td></td>
                  <ChipComponent
                    currentItemChips={currentItemChips_2_12}
                    tdKey={"td_other_2_12"}
                    chipKey={"chip_other_2_12"}
                    cell={this.other_2_12}
                    rowSpan={1}
                    colSpan={7}
                    leftMin={70}
                    leftMax={140}
                    cellClass={this.getClassNamesFromCellItemType(
                      NUMBERS_2_12,
                      null
                    )}
                    onCellClick={this.onCellClick} topMin={undefined} topMax={undefined}                  />
                  <td></td>
                  <ChipComponent
                    currentItemChips={currentItemChips_3_12}
                    tdKey={"td_other_3_12"}
                    chipKey={"chip_other_3_12"}
                    cell={this.other_3_12}
                    rowSpan={1}
                    colSpan={7}
                    leftMin={70}
                    leftMax={140}
                    cellClass={this.getClassNamesFromCellItemType(
                      NUMBERS_3_12,
                      null
                    )}
                    onCellClick={this.onCellClick} topMin={undefined} topMax={undefined}                  />
                </tr>
                <tr>
                  <td colSpan={2}></td>
                  <ChipComponent
                    currentItemChips={currentItemChips_1_18}
                    tdKey={"td_other_1_18"}
                    chipKey={"chip_other_1_18"}
                    cell={this.other_1_18}
                    rowSpan={1}
                    colSpan={3}
                    leftMin={30}
                    leftMax={60}
                    cellClass={this.getClassNamesFromCellItemType(
                      NUMBERS_1_18,
                      null
                    )}
                    onCellClick={this.onCellClick} topMin={undefined} topMax={undefined}                  />
                  <td></td>
                  <ChipComponent
                    currentItemChips={currentItemChips_even}
                    tdKey={"td_other_even"}
                    chipKey={"chip_other_even"}
                    cell={this.other_even}
                    rowSpan={1}
                    colSpan={3}
                    leftMin={30}
                    leftMax={60}
                    cellClass={this.getClassNamesFromCellItemType(
                      EVEN,
                      null
                    )}
                    onCellClick={this.onCellClick} topMin={undefined} topMax={undefined}                  />
                  <td></td>
                  <ChipComponent
                    currentItemChips={currentItemChips_red}
                    tdKey={"td_other_red"}
                    chipKey={"chip_other_red"}
                    cell={this.other_red}
                    rowSpan={1}
                    colSpan={3}
                    leftMin={30}
                    leftMax={60}
                    cellClass={this.getClassNamesFromCellItemType(
                      RED,
                      null
                    )}
                    onCellClick={this.onCellClick} topMin={undefined} topMax={undefined}                  />
                  <td></td>
                  <ChipComponent
                    currentItemChips={currentItemChips_black}
                    tdKey={"td_other_black"}
                    chipKey={"chip_other_black"}
                    cell={this.other_black}
                    rowSpan={1}
                    colSpan={3}
                    leftMin={30}
                    leftMax={60}
                    cellClass={this.getClassNamesFromCellItemType(
                      BLACK,
                      null
                    )}
                    onCellClick={this.onCellClick} topMin={undefined} topMax={undefined}                  />
                  <td></td>
                  <ChipComponent
                    currentItemChips={currentItemChips_odd}
                    tdKey={"td_other_odd"}
                    chipKey={"chip_other_odd"}
                    cell={this.other_odd}
                    rowSpan={1}
                    colSpan={3}
                    leftMin={30}
                    leftMax={60}
                    cellClass={this.getClassNamesFromCellItemType(
                      ODD,
                      null
                    )}
                    onCellClick={this.onCellClick} topMin={undefined} topMax={undefined}                  />
                  <td></td>
                  <ChipComponent
                    currentItemChips={currentItemChips_19_36}
                    tdKey={"td_other_19_36"}
                    chipKey={"chip_other_19_36"}
                    cell={this.other_19_36}
                    rowSpan={1}
                    colSpan={3}
                    leftMin={30}
                    leftMax={60}
                    cellClass={this.getClassNamesFromCellItemType(
                      NUMBERS_19_36,
                      null
                    )}
                    onCellClick={this.onCellClick} topMin={undefined} topMax={undefined}                  />
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Board;