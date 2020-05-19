function TextDiffBinding(element) {
  this.element = element;
}

TextDiffBinding.prototype._get =
TextDiffBinding.prototype._insert =
TextDiffBinding.prototype._remove = function() {
  throw new Error('`_get()`, `_insert(index, length)`, and `_remove(index, length)` prototype methods must be defined.');
};

TextDiffBinding.prototype._getElementValue = function(prevValue, newValue, e) {
  var value = newValue || '';
  // IE and Opera replace \n with \r\n. Always store strings as \n
  return value.replace(/\r\n/g, '\n');
};

TextDiffBinding.prototype._getInputEnd = function(previous, value) {
  if (this.element !== document.activeElement) return null;
  var end = value.length - this.element.selectionStart;
  if (end === 0) return end;
  if (previous.slice(previous.length - end) !== value.slice(value.length - end)) return null;
  return end;
};

TextDiffBinding.prototype.onInput = function(prevValue, newValue, e, compoThis) {
  var previous = this._get();
  var value = this._getElementValue(prevValue, newValue, e);
  if (previous === value) return;

  var start = 0;
  // Attempt to use the DOM cursor position to find the end
  var end = this._getInputEnd(previous, value);
  if (end === null) {
    // If we failed to find the end based on the cursor, do a diff. When
    // ambiguous, prefer to locate ops at the end of the string, since users
    // more frequently add or remove from the end of a text input
    while (previous.charAt(start) === value.charAt(start)) {
      start++;
    }
    end = 0;
    while (
      previous.charAt(previous.length - 1 - end) === value.charAt(value.length - 1 - end) &&
      end + start < previous.length &&
      end + start < value.length
    ) {
      end++;
    }
  } else {
    while (
      previous.charAt(start) === value.charAt(start) &&
      start + end < previous.length &&
      start + end < value.length
    ) {
      start++;
    }
  }
  if (previous.length !== start + end) {
    var removed = previous.slice(start, previous.length - end);
    this._remove(start, removed, e.changes[0].rangeOffset);
  }
  if (value.length !== start + end) {
    var inserted = value.slice(start, value.length - end);
    this._insert(start, inserted, e.changes[0].rangeOffset);
  }
};

TextDiffBinding.prototype.onInsert = function(rangeOffset, length, compoThis) {
  this._transformSelectionAndUpdate(rangeOffset, length, insertCursorTransform, compoThis);
};
function insertCursorTransform(rangeOffset, length, cursorOffset) {
  //rangeOffset->rangeOffset of editor which actually edited
  //cursorOffset->rangeOffset of my editor
  return (rangeOffset < cursorOffset) ? cursorOffset + length : cursorOffset;
}

TextDiffBinding.prototype.onRemove = function(rangeOffset, length, compoThis) {
  this._transformSelectionAndUpdate(rangeOffset, length, removeCursorTransform, compoThis);
};
function removeCursorTransform(rangeOffset, length, cursorOffset) {
  //rangeOffset->rangeOffset of editor which actually edited
  //cursorOffset->rangeOffset of my editor
  return (rangeOffset < cursorOffset) ? cursorOffset -= Math.min(length, cursorOffset - rangeOffset) : cursorOffset;
}

TextDiffBinding.prototype._transformSelectionAndUpdate = function(rangeOffset, length, transformCursor, compoThis) {
    // Todo: Fix cursor position on inserting newline
    let editor = compoThis.state.editor;
    var startOffset = transformCursor(rangeOffset, length, editor.getModel().getOffsetAt(editor.getPosition()));
    // var endOffset = transformCursor(rangeOffset, length, editor.getModel().getOffsetAt(editor.getPosition()));
    // var selectionDirection = this.element.selectionDirection;
    this.update(compoThis);
    // this.element.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
    editor.setSelection(new compoThis.state.monaco.Range(
      editor.getModel().getPositionAt(startOffset).lineNumber, editor.getModel().getPositionAt(startOffset).column,
      editor.getModel().getPositionAt(startOffset).lineNumber, editor.getModel().getPositionAt(startOffset).column,)
    );
};

TextDiffBinding.prototype.update = function(compoThis) {
  var value = this._get();
  if (this._getElementValue() === value) return;
  compoThis.setState({code:value});
};

export default TextDiffBinding;