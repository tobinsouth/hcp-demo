import { Box, Flex, Text } from '@radix-ui/themes';
import { ShoppingCartIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export function Navbar() {
  return (
    <Box asChild>
      <nav>
        <Flex align="center" justify="between" p="4">
          <Link href="/">
            <Flex align="center">
              <Text weight="bold" size="5" as="span" pl="1">
                HCP
              </Text>
            </Flex>
          </Link>
          <Flex align="center" gap="2">
            <Link href="/orders">
              <Flex align="center" gap="2">
                <ShoppingCartIcon />
                <Box asChild>
                  <div>Orders</div>
                </Box>
              </Flex>
            </Link>
            <form action="/api/auth/signout" method="post">
              <button type="submit">Sign out</button>
            </form>
          </Flex>
        </Flex>
      </nav>
    </Box>
  );
}
