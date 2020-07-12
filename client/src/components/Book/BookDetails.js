import React from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Image,
  Item,
  Dropdown,
  Divider,
  Comment,
  CommentAction,
  Button,
  Icon,
} from "semantic-ui-react";
import shelfOptions from "../../utils/shelfOptions";

const BookDetails = (props) => {
  return (
    <div className="container">
      <Grid columns={2} className="book-detail">
        <Grid.Row>
          <Grid.Column width={6}>
            <Image src="" />
            <Dropdown
              id="book-shelf-dropdown"
              defaultValue={1}
              selection
              options={shelfOptions}
            />
          </Grid.Column>
          <Grid.Column width={6} className="book-infos">
            <Item.Content>
              <Item.Header as="h1">Title</Item.Header>
              <p>
                by <Link> Author</Link>
              </p>
              <Item.Description>{"sinopse"}</Item.Description>
              <Divider horizontal>
                <h4>Specifications</h4>
              </Divider>
              <p>xxx pages</p>
              <p>Published xxxx</p>
            </Item.Content>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Comment.Group>
            <h3>Reviews</h3>
            <Comment>
              <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
              <Comment.Content>
                <Comment.Author as={Link}>User</Comment.Author>
                <Comment.Text>My review</Comment.Text>
                <Button>
                  <Icon name="favorite" />
                </Button>
                <Comment.Action>Reply</Comment.Action>
              </Comment.Content>
            </Comment>
          </Comment.Group>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default BookDetails;
