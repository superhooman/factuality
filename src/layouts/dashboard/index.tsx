'use client'

import { Box, Button, Flex, Heading, Separator } from "@radix-ui/themes"

import * as cls from './styles.css';
import { Cross1Icon, FilePlusIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Drawer } from "@src/components/Drawer";
import React from "react";
import { breakpoints } from "@src/styles/breakpoints";

interface DashboardLayoutProps {
    sidebar: React.ReactNode
}

export const DashboardLayout: React.FC<React.PropsWithChildren<DashboardLayoutProps>> = ({
    children,
    sidebar,
}) => {
    const [open, setOpen] = React.useState(false);

    const handleOpen = React.useCallback(() => {
        setOpen(true);
    }, []);

    const handleClose = React.useCallback(() => {
        setOpen(false);
    }, []);

    React.useEffect(() => {
        const onResize = () => {
            if (window.innerWidth > breakpoints.sm) {
                setOpen(false);
            }
        };

        window.addEventListener('resize', onResize);

        return () => window.removeEventListener('resize', onResize);
    }, []);

    const side = (
        <>
            <Flex justify="between">
                <Flex align="center" gap="2">
                    <Button onClick={handleClose} variant="soft" className={cls.close}>
                        <Cross1Icon />
                    </Button>
                    <Heading size="3" color="gray">Shyn Dashboard</Heading>
                </Flex>
                <Button size="2" asChild onClick={handleClose}>
                    <Link href="/dashboard">
                        <FilePlusIcon />
                        New
                    </Link>
                </Button>
            </Flex>
            <Separator size="4" orientation="horizontal" />
            {sidebar}
        </>
    )

    return (
        <Flex direction={{ initial: 'column', sm: 'row' }} className={cls.root}>
            <Flex direction="column" display={{ initial: 'flex', sm: 'none' }}>
                <Flex align="center" gap="2" p="4">
                    <Button variant="soft" size="2" onClick={handleOpen}>
                        <HamburgerMenuIcon />
                    </Button>
                    <Heading size="3" color="gray">Shyn Dashboard</Heading>
                </Flex>
                <Separator size="4" orientation="horizontal" />
            </Flex>
            <Drawer open={open} onOpenChange={setOpen}>
                <Flex direction="column" p="4" gap="3">
                    {side}
                </Flex>
            </Drawer>
            <Flex
                display={{ initial: 'none', sm: 'flex' }}
                direction="column" p="4" gap="3" shrink="0"
                className={cls.sidebar}
            >
                {side}
            </Flex>
            <Box grow="1" className={cls.wrapper}>
                <Box className={cls.container}>
                    {children}
                </Box>
            </Box>
        </Flex>
    )
}