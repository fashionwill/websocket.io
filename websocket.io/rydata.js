var rongcloudSDK = require( 'rongcloud-sdk' );
rongcloudSDK.init( 'vnroth0kv4u5o', 'GthFdbR8XOuE' );
rongcloudSDK.user.getToken( '13925057575', 'linfuning', 'http://cdn.ronghub.com/thinking-face.png', function( err, resultText ) {
	console.log(resultText);
  if( err ) {
    // Handle the error
  }
  else {
    var result = JSON.parse( resultText );
    if( result.code === 200 ) {
      //Handle the result.token
    }
  }
} );