export class Feedback {
  constructor(public feedbackDict: any) {
  }

  addFeedback(msg, row, field?) {
    if (this.feedbackDict[row] === undefined) {
      this.feedbackDict[row] = {};
    }
    if (field === undefined) {
      if (this.feedbackDict[row]['all'] === undefined) {
        this.feedbackDict[row]['all'] = [];
      }
      this.feedbackDict[row]['all'].push(msg);
    } else {
      if (this.feedbackDict[row][field] === undefined) {
        this.feedbackDict[row][field] = [];
      }
      this.feedbackDict[row][field].push(msg);
    }
  }

  removeFeedback(row, field?) {
    if (this.feedbackDict[row] !== undefined) {
      if (field === undefined) {
        delete this.feedbackDict[row];
      } else {
        delete this.feedbackDict[row][field];
      }
    }
  }

  // when the grid removes rows then the feedback rows ids should be updated
  removeRows(rowIndices) {
    // remove rows:
    for (let rowIndex of rowIndices) {
      delete this.feedbackDict[rowIndex];
    }
    // update new row indices:
    let oldRowsIndices = Object.keys(this.feedbackDict).sort();
    for (let oldPos of oldRowsIndices) {
      let newPos = this.getPos(oldPos, rowIndices);
      console.log(oldPos, newPos);
      this.feedbackDict[newPos] = this.feedbackDict[oldPos];
      if (newPos !== oldPos) {
        delete this.feedbackDict[oldPos];
      }
    }
    console.log('feedback:');
    console.log(this.feedbackDict);
  }

  private getPos(oldPos, list) {
    let newPos = oldPos;
    for (let x of list) {
      if (oldPos > x) {
        newPos--;
      }
      else {
        return newPos;
      }
    }
    return newPos;
  }

  getFeedback(row, field?) {
    if (this.feedbackDict[row] !== undefined) {
      let feedback;
      if (field === undefined) {
        feedback = this.feedbackDict[row]['all'];
      } else {
        feedback = this.feedbackDict[row][field];
      }
      return feedback
    }
    return null;
  }

  setFeedback(feedbackDict: any) {
    this.feedbackDict = feedbackDict;
  }

  mergeFeedback(feedbackDict: any) {
    for(let row in feedbackDict) {
      if(this.feedbackDict[row] === undefined) {
        this.feedbackDict[row] = {};
      }
      for(let col in feedbackDict[row]) {
        if(this.feedbackDict[row][col] === undefined) {
          this.feedbackDict[row][col] = [];
        }
        for(let item of feedbackDict[row][col]) {
          this.feedbackDict[row][col].push(item);
        }
      }
    }
  }

  clearFeedback() {
    this.feedbackDict = {};
  }

  errorsExist() {
    for(let row in this.feedbackDict) {
      for(let col in this.feedbackDict[row]) {
        if(col !== 'all') {
          for(let item of this.feedbackDict[row][col]) {
            if(item.type === 'error') {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
}
