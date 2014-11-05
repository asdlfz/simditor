(function() {
  describe('Simditor Buttons Module', function() {
    var editor, findButtonLink, setRange, toolbar;
    editor = null;
    toolbar = ['bold', 'title', 'italic', 'underline', 'strikethrough', 'color', 'ol', 'ul', 'blockquote', 'code', 'table', 'link', 'image', 'hr', 'indent', 'outdent'];
    beforeEach(function() {
      var tmp;
      $('<textarea id="test"></textarea>').appendTo('body');
      editor = new Simditor({
        textarea: '#test',
        toolbar: toolbar
      });
      editor.body.empty();
      tmp = '<p>Simditor 是团队协作工具 <a href="http://tower.im">Tower</a> 使用的富文本编辑器。</p>\n<p >相比传统的编辑器它的特点是：</p>\n<ul >\n  <li >功能精简，加载快速</li>\n  <li >输出格式化的标准<font > HTML </font></li>\n  <li >每一个功能都有非常优秀的使用体验</li>\n</ul>\n<pre >this is a code snippet</pre>\n<p >兼容的浏览器：IE10+、Chrome、Firefox、Safari。</p>\n<blockquote>\n    <p >First line</p>\n    <p ><br/></p>\n</blockquote>\n<hr/>\n<p >After hr</p>\n<p >test</p>';
      editor.setValue(tmp);
      return editor.sync();
    });
    afterEach(function() {
      if (editor != null) {
        editor.destroy();
      }
      return $('#test').remove();
    });
    setRange = function(ele, offsetStart, offsetEnd) {
      var offset, range;
      ele = ele[0];
      range = document.createRange();
      if (!offset) {
        offset = 0;
      }
      range.setStart(ele, offsetStart);
      range.setEnd(ele, offsetEnd);
      editor.focus();
      return editor.selection.selectRange(range);
    };
    findButtonLink = function(name) {
      var buttonLink;
      buttonLink = editor.toolbar.list.find('a.toolbar-item-' + name);
      return buttonLink != null ? buttonLink : null;
    };
    it('should let content bold when bold button clicked or by shortcut', function() {
      setRange(editor.body.find('p').eq(1), 0, 1);
      findButtonLink('bold').trigger('mousedown');
      return expect(editor.selection.getRange().commonAncestorContainer.parentNode).toEqual('b');
    });
    it('should let content italic when italic button clicked or by shortcut', function() {
      setRange(editor.body.find('p').eq(1), 0, 1);
      findButtonLink('italic').trigger('mousedown');
      return expect(editor.selection.getRange().commonAncestorContainer.parentNode).toEqual('i');
    });
    it('should let content underline when underline button clicked or by shortcut', function() {
      setRange(editor.body.find('p').eq(1), 0, 1);
      findButtonLink('underline').trigger('mousedown');
      return expect(editor.selection.getRange().commonAncestorContainer.parentNode).toEqual('u');
    });
    it('should let content strike when strikethrough button clicked', function() {
      setRange(editor.body.find('p').eq(1), 0, 1);
      findButtonLink('strikethrough').trigger('mousedown');
      return expect(editor.selection.getRange().commonAncestorContainer.parentNode).toEqual('strike');
    });
    it('should let content indent when indent button clicked', function() {
      setRange(editor.body.find('p').eq(1), 0, 1);
      findButtonLink('indent').trigger('mousedown');
      return expect(editor.selection.getRange().commonAncestorContainer).toHaveAttr('data-indent', '1');
    });
    it('should let content outdent when  outdent button clicked', function() {
      setRange(editor.body.find('p').eq(1), 0, 1);
      findButtonLink('indent').trigger('mousedown');
      findButtonLink('outdent').trigger('mousedown');
      return expect(editor.selection.getRange().commonAncestorContainer).toHaveAttr('data-indent', '0');
    });
    it('should insert a hr when hr button clicked', function() {
      setRange(editor.body.find('p').eq(1), 0, 1);
      findButtonLink('hr').trigger('mousedown');
      return expect(editor.selection.getRange().commonAncestorContainer.nextSibling).toEqual('hr');
    });
    it('should change content color when color button clicked', function() {
      setRange(editor.body.find('p').eq(1), 0, 1);
      expect(editor.toolbar.wrapper.find('.color-list')).not.toBeVisible();
      findButtonLink('color').trigger('mousedown');
      expect(editor.toolbar.wrapper.find('.color-list')).toBeVisible();
      editor.toolbar.wrapper.find('.font-color-1').click();
      return expect($(editor.selection.getRange().commonAncestorContainer.parentNode)).toEqual('font[color]');
    });
    it('should let content be title when title button clicked', function() {
      setRange(editor.body.find('p').eq(1), 0, 0);
      findButtonLink('title').trigger('mousedown');
      editor.toolbar.wrapper.find('.menu-item-h1').click();
      return expect($(editor.selection.getRange().commonAncestorContainer)).toEqual('h1');
    });
    return it('should create list when list button clicked', function() {
      var parentNode;
      setRange = function(ele1, offset1, ele2, offset2) {
        var range;
        if (!ele2) {
          ele2 = ele1;
          offset2 = offset1;
        }
        ele1 = ele1[0];
        ele2 = ele2[0];
        range = document.createRange();
        range.setStart(ele1, offset1);
        range.setEnd(ele2, offset2);
        editor.focus();
        return editor.selection.selectRange(range);
      };
      setRange(editor.body.find('p').eq(1), 0);
      findButtonLink('ul').trigger('mousedown');
      parentNode = $(editor.selection.getRange().commonAncestorContainer);
      expect(parentNode).toEqual('li');
      expect(parentNode.parent()).toBeMatchedBy('ul');
      findButtonLink('ul').trigger('mousedown');
      parentNode = $(editor.selection.getRange().commonAncestorContainer);
      expect(parentNode).toEqual('p');
      setRange(editor.body.find('li').eq(0), 0, editor.body.find('li').eq(2), 1);
      findButtonLink('ul').trigger('mousedown');
      parentNode = $(editor.selection.getRange().commonAncestorContainer);
      expect(parentNode).not.toEqual('ul');
      expect(parentNode.find('li')).not.toExist();
      findButtonLink('ul').trigger('mousedown');
      parentNode = $(editor.selection.getRange().commonAncestorContainer);
      expect(parentNode).toEqual('ul');
      return expect(parentNode.find('li').length).toBe(3);
    });
  });

}).call(this);
