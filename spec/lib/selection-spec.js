(function() {
  describe('Simditor Selection Module', function() {
    var compareRange, editor, setRange;
    editor = null;
    beforeEach(function() {
      var tmp;
      $('<textarea id="test"></textarea>').appendTo('body');
      editor = new Simditor({
        textarea: '#test'
      });
      tmp = '<p>Simditor 是团队协作工具 <a href="http://tower.im">Tower</a> 使用的富文本编辑器。</p>\n<p>相比传统的编辑器它的特点是：</p>\n<ul>\n  <li >功能精简，<font >加载快速</font></li>\n  <li >输出格式化的标准 HTML</li>\n  <li >每一个功能都有非常优秀的使用体验</li>\n</ul>';
      editor.setValue(tmp);
      console.log(editor.body[0]);
      return editor.sync();
    });
    afterEach(function() {
      if (editor != null) {
        editor.destroy();
      }
      return $('#test').remove();
    });
    compareRange = function(range1, range2) {
      if (!((range1.endContainer != null) || (range2.endContainer != null))) {
        return false;
      }
      if (!(range1.endContainer === range2.endContainer || range1.endOffset === range2.endOffset || range1.startContainer === range2.startContainer || range1.startOffset === rang2.startOffset)) {
        return false;
      }
      return true;
    };
    setRange = function(ele1, offset1, ele2, offset2) {
      var range;
      ele1 = ele1[0];
      ele2 = ele2[0];
      range = document.createRange();
      range.setStart(ele1, offset1);
      range.setEnd(ele2, offset2);
      editor.focus();
      return editor.selection.selectRange(range);
    };
    it('can set range and get range', function() {
      var range, tmp;
      editor.body.empty();
      tmp = $('<blockquote id="test1">this is <font>test</font> text</blockquote>');
      editor.setValue(tmp);
      editor.sync();
      range = document.createRange();
      range.setStart(editor.body.find('blockquote')[0], 0);
      range.setEnd(editor.body.find('blockquote > font')[0], 0);
      editor.focus();
      editor.selection.selectRange(range);
      expect(compareRange(editor.selection.getRange(), range)).toBe(true);
      editor.selection.clear();
      return expect(editor.selection.getRange()).toBe(null);
    });
    it('can set range end after a node', function() {
      setRange(editor.body.find('ul > li > font'), 0, editor.body.find('li').eq(1).contents(), 4);
      editor.selection.setRangeAfter(editor.body.find('li').eq(2));
      return expect(editor.selection.getRange().startOffset).toBe(6);
    });
    it('can set range start before a node', function() {
      setRange(editor.body.find('ul > li > font'), 0, editor.body.find('li').eq(1).contents(), 4);
      editor.selection.setRangeBefore(editor.body.find('li').eq(0));
      return expect(editor.selection.getRange().startOffset).toBe(1);
    });
    it('can set range at start of a nope', function() {
      setRange(editor.body.find('ul > li > font'), 0, editor.body.find('li').eq(1).contents(), 4);
      editor.selection.setRangeAtStartOf(editor.body.find('li').eq(0));
      return expect(editor.selection.getRange().endContainer).toBe(editor.body.find('li').eq(0)[0]);
    });
    it('can set range at end of a node', function() {
      setRange(editor.body.find('ul > li > font'), 0, editor.body.find('li').eq(1).contents(), 4);
      editor.selection.setRangeAtEndOf(editor.body.find('li').eq(1));
      return expect(editor.selection.getRange().endContainer).toBe(editor.body.find('li').eq(1)[0]);
    });
    return it('can judge range whether it\'s at start or end of a node', function() {
      var range;
      range = document.createRange();
      range.setStart(editor.body.find('ul > li > font')[0], 0);
      range.collapse();
      expect(editor.selection.rangeAtStartOf(editor.body.find('ul > li > font')[0], range)).toBeTruthy();
      range = document.createRange();
      range.setEnd(editor.body.find('ul > li > font')[0], 1);
      range.collapse(false);
      return expect(editor.selection.rangeAtEndOf(editor.body.find('ul > li > font')[0], range)).toBeTruthy();
    });
  });

}).call(this);
