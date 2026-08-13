import Feather from '@expo/vector-icons/Feather';
import { type Href, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Image,
  type ImageSourcePropType,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type AnchorRect = {
  height: number;
  width: number;
  x: number;
  y: number;
};

type UserProfileDropdownProps = {
  accountHref?: Href;
  avatarSource: ImageSourcePropType;
  compact?: boolean;
  name?: string;
  onLogout: () => void;
  role?: string;
  storesHref?: Href;
};

export function UserProfileDropdown({
  accountHref = '/admin/account-settings' as Href,
  avatarSource,
  compact = false,
  name = 'Takt Admin',
  onLogout,
  role = 'Inventory Console',
  storesHref = '/admin/stores' as Href,
}: UserProfileDropdownProps) {
  const router = useRouter();
  const triggerRef = useRef<View>(null);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);
  const [open, setOpen] = useState(false);

  function openMenu() {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setAnchor({ height, width, x, y });
      setOpen(true);
    });
  }

  function navigateTo(href: Href) {
    setOpen(false);
    router.push(href);
  }

  function handleLogout() {
    setOpen(false);
    onLogout();
  }

  return (
    <View ref={triggerRef} collapsable={false}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={openMenu}
        style={({ pressed }) => [styles.trigger, compact && styles.triggerCompact, pressed && styles.triggerPressed]}
      >
        <Image source={avatarSource} style={styles.avatar} />

        {!compact ? (
          <View style={styles.userCopy}>
            <Text numberOfLines={1} style={styles.name}>{name}</Text>
            <Text numberOfLines={1} style={styles.role}>{role}</Text>
          </View>
        ) : null}

        {!compact ? <Feather name={open ? 'chevron-up' : 'chevron-down'} size={18} color="#CBD5E1" /> : null}
      </Pressable>

      <Modal animationType="fade" transparent visible={open} onRequestClose={() => setOpen(false)}>
        <View style={styles.modalRoot}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setOpen(false)} />

          {anchor ? (
            <View style={[styles.dropdown, { left: anchor.x, top: anchor.y + anchor.height + 8, width: Math.max(anchor.width, 184) }]}>
              <Pressable
                onPress={() => navigateTo(accountHref)}
                style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
              >
                <Feather name="settings" size={16} color="#CBD5E1" />
                <Text style={styles.menuText}>Account Settings</Text>
              </Pressable>

              <Pressable
                onPress={() => navigateTo(storesHref)}
                style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
              >
                <Feather name="briefcase" size={16} color="#CBD5E1" />
                <Text style={styles.menuText}>Manage Stores</Text>
              </Pressable>

              <View style={styles.divider} />

              <Pressable
                onPress={handleLogout}
                style={({ pressed }) => [styles.menuItem, pressed && styles.logoutPressed]}
              >
                <Feather name="log-out" size={16} color="#F87171" />
                <Text style={styles.logoutText}>Log out</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 8,
    height: 40,
    width: 40,
  },
  divider: {
    backgroundColor: 'rgba(148, 163, 184, 0.18)',
    height: 1,
    marginVertical: 8,
  },
  dropdown: {
    backgroundColor: '#1E293B',
    borderColor: 'rgba(148, 163, 184, 0.22)',
    borderRadius: 8,
    borderWidth: 1,
    elevation: 12,
    padding: 8,
    position: 'absolute',
    shadowColor: '#020617',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.24,
    shadowRadius: 24,
  },
  logoutPressed: {
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
  },
  logoutText: {
    color: '#F87171',
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
  },
  menuItem: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    minHeight: 40,
    paddingHorizontal: 8,
  },
  menuItemPressed: {
    backgroundColor: '#334155',
  },
  menuText: {
    color: '#E2E8F0',
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  modalRoot: {
    flex: 1,
  },
  name: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  role: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  trigger: {
    alignItems: 'center',
    backgroundColor: '#334155',
    borderColor: 'rgba(148, 163, 184, 0.24)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 56,
    padding: 8,
  },
  triggerPressed: {
    backgroundColor: '#3F4E63',
  },
  triggerCompact: {
    justifyContent: 'center',
    minHeight: 56,
    padding: 8,
  },
  userCopy: {
    flex: 1,
    minWidth: 0,
  },
});
