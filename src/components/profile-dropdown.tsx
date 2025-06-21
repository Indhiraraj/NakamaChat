import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu'
import { signOutUser } from '@/supabase-functions/auth'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Avatar } from './ui/avatar'
import type { Profile } from '@/supabase-functions/chat'
import { UpdateProfileDialog } from './profile-dialog'

const ProfileDropdown = ({ currentUser }: { currentUser: Profile }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className='cursor-pointer' avatarUrl={currentUser?.avatar_url} username={currentUser?.username!} />

      </DropdownMenuTrigger>
      <DropdownMenuContent>

        <DropdownMenuItem onClick={(e) => {
          e.preventDefault()
        }}>
          <UpdateProfileDialog
            trigger={<p className='w-full'>profile</p>} defaultOpen={false}
          />

        </DropdownMenuItem>
        <DropdownMenuItem onClick={signOutUser}>
          logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileDropdown