// tutorial17.js
// adding handler in comment box to deal with new comments coming in
var Comment = React.createClass({
    render: function(){
        var rawMarkup = marked(this.props.children.toString(),{sanitize: true});
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}
                </h2>
                <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
        var commentNodes = this.props.data.map(function (comment){
            return (
                <Comment author={comment.author}>
                    {comment.text}
                </Comment>
            );
        });

        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
});

var CommentForm = React.createClass({
    handleSubmit: function (e) {
        e.preventDefault(); // prevents reloading page
        var author = React.findDOMNode(this.refs.author).value.trim();
        var text = React.findDOMNode(this.refs.text).value.trim();
        if (!text || !author){
            return;
        }
        // TODO : send request to server
        React.findDOMNode(this.refs.author).value = ''; // reset value for next
        React.findDOMNode(this.refs.text).value = ''; // reset value as well
        return;
    },
    render: function() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type='text' placeholder="Your name" ref="author" />
                <input type='text' placeholder="Say something whitty..." ref="text"/>
                <input type='submit' value="Post" />
            </form>
        );
    }
});

var CommentBox = React.createClass({
    // it makes sense to do all of this logic for comments
    // inside of comment box because CommentBox owns the state
    // that represents the list of comments
    loadCommentsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data){
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err){
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleCommentSubmit: function (comment){
        // TODO: submit to the server and refresh the list
        console.log("oooo received a new comment" , comment);
    },
    getInitialState: function() {
        // executes exactl once during the lifecycle of the component
        // sets up initial state of the component
        return {data: []};
    },
    componentDidMount: function(){
        // this method is called automatically by React when a component is rendered
        // so each time? our component is rendered it calls this?  or just once
        // apparently only once
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function(){
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data}/>
                <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
            </div>
        );
    }
});

var data = [
    {author: "Pete Hunt", text: "This is one comment"},
    {author: "Jordan Walke", text: "This is _really_ **another** comment"}
]

React.render(
    <CommentBox url="comments.json" pollInterval={2000} />,
    document.querySelector('#content')
)
