describe 'Simditor Buttons Module', ->
  editor = null
  toolbar = ['bold','title',  'italic', 'underline', 'strikethrough', 'color', 'ol', 'ul', 'blockquote', 'code', 'table', 'link', 'image', 'hr', 'indent', 'outdent']
  beforeEach ->
    $('<textarea id="test"></textarea>').appendTo 'body'
    editor = new Simditor
      textarea: '#test'
      toolbar: toolbar

    editor.body.empty()
    tmp = '''
    <p>Simditor 是团队协作工具 <a href="http://tower.im">Tower</a> 使用的富文本编辑器。</p>
    <p >相比传统的编辑器它的特点是：</p>
    <ul >
      <li >功能精简，加载快速</li>
      <li >输出格式化的标准<font > HTML </font></li>
      <li >每一个功能都有非常优秀的使用体验</li>
    </ul>
    <pre >this is a code snippet</pre>
    <p >兼容的浏览器：IE10+、Chrome、Firefox、Safari。</p>
    <blockquote>
        <p >First line</p>
        <p ><br/></p>
    </blockquote>
    <hr/>
    <p >After hr</p>
    <p >test</p>
    '''
    editor.setValue(tmp)
    editor.sync()

  afterEach ->
    editor?.destroy()
    $('#test').remove()

  setRange = (ele, offsetStart, offsetEnd) ->
    ele = ele[0]
    range = document.createRange()
    unless offset
      offset = 0
    range.setStart ele, offsetStart
    range.setEnd ele, offsetEnd
    editor.focus()
    editor.selection.selectRange range

  findButtonLink = (name) ->
    buttonLink = editor.toolbar.list.find('a.toolbar-item-' + name)
    buttonLink ? null

  it 'should let content bold when bold button clicked or by shortcut', ->
    setRange(editor.body.find('p').eq(1), 0, 1)
    findButtonLink('bold').trigger 'mousedown'
    expect(editor.selection.getRange().commonAncestorContainer.parentNode).toEqual('b')

  it 'should let content italic when italic button clicked or by shortcut', ->
    setRange(editor.body.find('p').eq(1), 0, 1)
    findButtonLink('italic').trigger 'mousedown'
    expect(editor.selection.getRange().commonAncestorContainer.parentNode).toEqual('i')

  it 'should let content underline when underline button clicked or by shortcut', ->
    setRange(editor.body.find('p').eq(1), 0, 1)
    findButtonLink('underline').trigger 'mousedown'
    expect(editor.selection.getRange().commonAncestorContainer.parentNode).toEqual('u')

  it 'should let content strike when strikethrough button clicked', ->
    setRange(editor.body.find('p').eq(1), 0, 1)
    findButtonLink('strikethrough').trigger 'mousedown'
    expect(editor.selection.getRange().commonAncestorContainer.parentNode).toEqual('strike')

  it 'should let content indent when indent button clicked', ->
    setRange(editor.body.find('p').eq(1), 0, 1)
    #will call util.indent
    findButtonLink('indent').trigger 'mousedown'
    expect(editor.selection.getRange().commonAncestorContainer).toHaveAttr('data-indent', '1')

  it 'should let content outdent when  outdent button clicked', ->
    setRange(editor.body.find('p').eq(1), 0, 1)
    findButtonLink('indent').trigger 'mousedown'
    findButtonLink('outdent').trigger 'mousedown'
    expect(editor.selection.getRange().commonAncestorContainer).toHaveAttr('data-indent', '0')

  it 'should insert a hr when hr button clicked', ->
    setRange(editor.body.find('p').eq(1), 0, 1)
    findButtonLink('hr').trigger 'mousedown'
    expect(editor.selection.getRange().commonAncestorContainer.nextSibling).toEqual('hr')

  it 'should change content color when color button clicked', ->
    setRange(editor.body.find('p').eq(1), 0, 1)
    expect(editor.toolbar.wrapper.find('.color-list')).not.toBeVisible()
    findButtonLink('color').trigger 'mousedown'
    expect(editor.toolbar.wrapper.find('.color-list')).toBeVisible()

    editor.toolbar.wrapper.find('.font-color-1').click()
    expect($ editor.selection.getRange().commonAncestorContainer.parentNode).toEqual('font[color]')

  it 'should let content be title when title button clicked', ->
    setRange(editor.body.find('p').eq(1), 0, 0)
    findButtonLink('title').trigger 'mousedown'
    editor.toolbar.wrapper.find('.menu-item-h1').click()
    expect($ editor.selection.getRange().commonAncestorContainer).toEqual('h1')

  it 'should create list when list button clicked', ->
    setRange = (ele1, offset1, ele2, offset2) ->
      unless ele2
        ele2 = ele1
        offset2 = offset1
      ele1 = ele1[0]
      ele2 = ele2[0]
      range = document.createRange()
      range.setStart ele1, offset1
      range.setEnd ele2, offset2
      editor.focus()
      editor.selection.selectRange range

    #UnorderedList
    #click on collapsed range
    setRange(editor.body.find('p').eq(1), 0)
    findButtonLink('ul').trigger 'mousedown'
    parentNode = $ editor.selection.getRange().commonAncestorContainer
    expect(parentNode).toEqual('li')
    expect(parentNode.parent()).toBeMatchedBy('ul')

    #click again to toggle list
    findButtonLink('ul').trigger 'mousedown'
    parentNode = $ editor.selection.getRange().commonAncestorContainer
    expect(parentNode).toEqual('p')

    #click on a range of nodes
    setRange(editor.body.find('li').eq(0), 0, editor.body.find('li').eq(2), 1)
    findButtonLink('ul').trigger 'mousedown'
    parentNode = $ editor.selection.getRange().commonAncestorContainer
    expect(parentNode).not.toEqual('ul')
    expect(parentNode.find('li')).not.toExist()

    findButtonLink('ul').trigger 'mousedown'
    parentNode = $ editor.selection.getRange().commonAncestorContainer
    expect(parentNode).toEqual('ul')
    expect(parentNode.find('li').length).toBe(3)

    #OL is same to UL, no need to test again

  #TODO add link, code, image
