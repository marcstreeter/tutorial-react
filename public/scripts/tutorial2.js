//tutoria2.js
var CommentList = React.createClass({
    render: function() {
        return (
            <div className="commentList">
                Hello, world! I am a comment list
            </div>
        );
    }
});

var CommentForm = React.createClass({
    render: function() {
        return (
            <div className="commentForm">
                Hello, world! I am a comment form.
            </div>
        );
    }
});

var CommentBox = React.createClass({
    render: function(){
        return (
            <div className="commentBox">
                Hello, world! I am a CommentBox.
            </div>
        );
    }
});

React.render(
    <CommentBox />,
    document.querySelector('#content')
)
