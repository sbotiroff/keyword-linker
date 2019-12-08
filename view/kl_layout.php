<div class="kl-wrapper">
  <div class="kl-keyword-input">
    <input type="text" id="klKeywordSearch" placeholder = "Type your keyword here"/>
  </div>
  <div id="klPagesContainer" class="kl-pages-container">
    <h2>Pages</h2>
    <table>
      <thead>
        <tr>
          <th>
            Title
          </th>
          <th>
            Url
          </th>
          <th>
            Tags(h1,h2,strong)
          </th>
          <th>
            Page content
          </th>
          <th>
          </th>
        </tr>
      </thead>
      <tbody id="klTableBody">
      </tbody>
      <tfoot id="klTableFooter">
      </tfoot>
    </table>
  </div>
  <div class="kl-keyword-replace">
    <h2>
      Attach The Link
    </h2>
    <div>
      <h4>Your Keyword:</h4>
      <input type="text" id="klKeywordOutput" placeholder = "Nothing Found" readonly>
    </div>
    <div>
      <h4>Keyword Position:</h4>
      <span>Link to</span><input type="number" min="1" placeholder="number" style="width:80px;" id="keywordPosition"><span>keyword that matches in the pages (Example: Link to 1 keyword that matches in the pages)</span>
    </div>
    <div>
      <h4>Your Link Here:<h4>
      <input type="text" id ="replacerInput" placeholder ="http://">
    </div>
    <button onclick ="keywordReplacer()" style="margin:auto; display:block">Attach</button>
  </div>
  <button style="margin:auto; display:block" onclick="klUploadToTheDB()">SAVE</button>
  <p class="isUploaded"></p>
</div>

<?php


$allPages = get_pages();
$json = []; 
foreach( $allPages as $page ) {
  if($page->post_content ===""){
    continue;
  }	
  $json[] = [
    'ID'=>$page->ID,
    'post_content'=>$page->post_content,
    'post_title'=>$page->post_title,
    'guid'=>get_permalink($page->ID)
];
}	
?>
<script>
   </script>

<script>
var json = <?php echo json_encode($json,JSON_PRETTY_PRINT); ?>;
</script>