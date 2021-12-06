import { observable } from "mobx";
import { Button, Container, Menu } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";

export default function NavBar() {
  const { todoStore } = useStore();

  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header>
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "10px" }}
          />
          My Todo
        </Menu.Item>
        <Menu.Item name="Todos" />
        <Menu.Item>
          <Button
            onClick={() => todoStore.openForm()}
            color="green"
            content="Create Task"
          />
        </Menu.Item>
      </Container>
    </Menu>
  );
}
