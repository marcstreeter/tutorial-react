// tutorial20a.js
// optimistic -- wait wut??? you really can't see a difference because
// we are setting the value with whatever we get from the server
// which is done pretty fast, so instead of depending on what is returned
// we will depend on our interval to reload, lets turn off our optimistic stuff
// too so that we can feel the delay ....
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
        // send request to server
        this.props.onCommentSubmit({author: author, text: text});
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
        // optimistic  ---- start (set before server response)
        var curCommentState = this.state.data;
        // notice the use of concat, instead of push, since push is in place modification
        // concat does not alter the array's state it only creates a new array and sends that
        // up the line
        var newCommentState = curCommentState.concat([comment]);
        //this.setState({data: newCommentState});
        // optimistic --- end

        console.log("oooo received a new comment" , comment);
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: comment,
            success: function (data){
                // we comment this out because the response is so quick we don't
                // see the benefits of the optimistic update that happens elsewhere
                // plus not every API when updating something is given the new state of the
                // entire comments / items, so it makes sense to remove this anyways
                // as our interval should be in charge of polling, and this is interfering
                console.log("comment successfully received :)")
                //this.setState({data: data});  // here we rerender our comments with what was returned
            }.bind(this),
            error: function (xhr, status, err){
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        })
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
    <CommentBox url="comments.json" pollInterval={10000} />, // increased time to wait to eccentuate the delay
    document.querySelector('#content')
)
