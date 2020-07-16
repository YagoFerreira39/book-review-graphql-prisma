import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
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

const BookDetails = ({
  book: { id, title, sinopse, genre, pages, published, author },
}) => {
  if (author) {
    console.log(author.name);
  }
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
              <Item.Header as="h1">{title}</Item.Header>
              <p>
                by{" "}
                {author ? (
                  <Link to={`/author/${author.name}/${author.id}`}>
                    {author.name}
                  </Link>
                ) : null}
              </p>
              <Item.Description>{sinopse}</Item.Description>
              <Divider horizontal>
                <h4>Specifications</h4>
              </Divider>
              <p>{pages} pages</p>
              <p>Published {published}</p>
            </Item.Content>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Comment.Group>
            <h3>Reviews</h3>
            <Divider />
            <Comment>
              <Comment.Avatar src="https://react.semantic-ui.com/images/avatar/small/matt.jpg" />
              <Comment.Content>
                <Comment.Author as={Link} to={`/user/`}>
                  User
                </Comment.Author>
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
