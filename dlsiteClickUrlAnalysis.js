const GET_TITLE_URL = 'https://zero-distance.lsv.jp/get_title.php';

$(function() {
  // クリック URL に取得ボタンを追加
  $('#af_report_data th:first').html('URL&nbsp<button class="jsDlsiteClickUrlAnalysis">タイトル取得</button>');

  // タイトル取得ボタン押下時
  $('.jsDlsiteClickUrlAnalysis').click(function() {
    var urls = $('#af_report_data tbody').find('td:nth-child(2n+1)');
    urls.each(function() {
      var event = $(this);
      var originalText = event.text();
      // GET 値の前までを取得
      var targetPageUrl = '';
      if (originalText.match(/(.*)\/\?/)) {
        targetPageUrl = originalText.match(/(.*)\/\?/)[1];
      }
      var matomeNumber = '';
      var title = '';
      var matomeTitle = '';

      if (originalText.match(/matome%2F(.*)/)) {
        matomeNumber = originalText.match(/matome%2F(.*)/)[1];
        if (matomeNumber.match(/(.*)%3Fdls/)) {
          matomeNumber = matomeNumber.match(/(.*)%3Fdls/)[1];
        }
      };

      // 対象の作品ページのタイトル取得
      $.ajax({
        type: 'GET',
        url: targetPageUrl,
        data: '',
        dataType: 'html'
      }).done(function(data) {
        title = getTitle(data);
        // まとめページのタイトル
        if (matomeNumber !== '') {
          $.ajax({
            type: 'GET',
            url: GET_TITLE_URL,
            data: {number: matomeNumber},
            dataType: 'html'
          }).done(function(data) {
            matomeTitle = getTitle(data);
            event.html(originalText + '<br><b>' + title + '</b><br><b>' + matomeTitle + '</b>');
          });
        } else {
          event.html(originalText + '<br><b>' + title + '</b>');
        }
      });

      // クリック URL の取得ボタンを削除
      $('#af_report_data th:first').html('URL');

    });
  });

  /**
   * html からタイトルを取得する
   */
  function getTitle(str) {
    var result = '';
    if (str.match(/<title>(.*)<\/title>/)) {
      result = str.match(/<title>(.*)<\/title>/)[1];
    }

    return result;
  }
});