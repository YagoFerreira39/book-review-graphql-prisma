import React from "react";
import { Link } from "react-router-dom";
import { Card, Icon, Image } from "semantic-ui-react";

const BookCard = ({
  book: { title, sinopse, genre, pages, published, author },
}) => {
  return (
    <Card as={Link} to="/">
      <Image
        src="https://react.semantic-ui.com/images/avatar/large/matthew.png"
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{title}</Card.Header>
        <Card.Meta>
          <span className="date">{genre}</span>
        </Card.Meta>
        <Card.Description>{sinopse}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Link>
          <Icon name="user" />
          {author.name}
        </Link>
      </Card.Content>
    </Card>
  );
};

export default BookCard;
