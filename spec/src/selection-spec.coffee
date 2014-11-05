describe 'Simditor Selection Module', ->
  editor = null
  beforeEach ->
    $('<textarea id="test"></textarea>').appendTo 'body'
    editor = new Simditor
      textarea: '#test'
    tmp = '''
    <p>Simditor 是团队协作工具 <a href="http://tower.im">Tower</a> 使用的富文本编辑器。</p>
    <p>相比传统的编辑器它的特点是：</p>
    <ul>
      <li >功能精简，<font >加载快速</font></li>
      <li >输出格式化的标准 HTML</li>
      <li >每一个功能都有非常优秀的使用体验</li>
    </ul>
    '''
    editor.setValue(tmp)
    console.log editor.body[0]
    editor.sync()

  afterEach ->
    editor?.destroy()
    $('#test').remove()

  compareRange = (range1, range2) ->
    return false unless range1.endContainer? or range2.endContainer?
    return false unless range1.endContainer == range2.endContainer \
      or range1.endOffset == range2.endOffset \
      or range1.startContainer == range2.startContainer \
      or range1.startOffset == rang2.startOffset
    true

  setRange = (ele1, offset1, ele2, offset2) ->
    ele1 = ele1[0]
    ele2 = ele2[0]
    range = document.createRange()
    range.setStart ele1, offset1
    range.setEnd ele2, offset2
    editor.focus()
    editor.selection.selectRange range

  it 'can set range and get range', ->
    editor.body.empty()
    tmp = $('<blockquote id="test1">this is <font>test</font> text</blockquote>')
    editor.setValue(tmp)
    editor.sync()

    range = document.createRange();
    range.setStart editor.body.find('blockquote')[0], 0
    range.setEnd editor.body.find('blockquote > font')[0], 0
    editor.focus()
    editor.selection.selectRange range

    expect(compareRange(editor.selection.getRange(), range)).toBe(true)
    editor.selection.clear()
    expect(editor.selection.getRange()).toBe(null)

  it 'can set range end after a node', ->
    setRange(editor.body.find('ul > li > font'), 0, editor.body.find('li').eq(1).contents(), 4)
    editor.selection.setRangeAfter editor.body.find('li').eq(2)
    expect(editor.selection.getRange().startOffset).toBe(6)

  it 'can set range start before a node', ->
    setRange(editor.body.find('ul > li > font'), 0, editor.body.find('li').eq(1).contents(), 4)
    editor.selection.setRangeBefore editor.body.find('li').eq(0)
    expect(editor.selection.getRange().startOffset).toBe(1)

  it 'can set range at start of a nope', ->
    setRange(editor.body.find('ul > li > font'), 0, editor.body.find('li').eq(1).contents(), 4)
    editor.selection.setRangeAtStartOf editor.body.find('li').eq(0)
    expect(editor.selection.getRange().endContainer).toBe(editor.body.find('li').eq(0)[0])

  it 'can set range at end of a node', ->
    setRange(editor.body.find('ul > li > font'), 0, editor.body.find('li').eq(1).contents(), 4)
    editor.selection.setRangeAtEndOf editor.body.find('li').eq(1)
    expect(editor.selection.getRange().endContainer).toBe(editor.body.find('li').eq(1)[0])

  it 'can judge range whether it\'s at start or end of a node', ->
    range = document.createRange()
    range.setStart(editor.body.find('ul > li > font')[0], 0)
    range.collapse()
    expect(editor.selection.rangeAtStartOf(editor.body.find('ul > li > font')[0], range)).toBeTruthy()

    range = document.createRange()
    range.setEnd(editor.body.find('ul > li > font')[0], 1)
    range.collapse false
    expect(editor.selection.rangeAtEndOf(editor.body.find('ul > li > font')[0], range)).toBeTruthy()