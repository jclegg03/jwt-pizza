import React from 'react';
import View from '../general/view';
import { useNavigate } from 'react-router-dom';
import { pizzaService } from '../../service/service';
import { User } from '../../service/pizzaService';
import { TrashIcon } from '../../icons';
import Button from '../../components/button';


export default function UsersView() {
  const navigate = useNavigate();
  const [userList, setUserList] = React.useState<User[]>([]);
  const [page, setPage] = React.useState(1);
  const filterRef = React.useRef<HTMLInputElement>(null);


  React.useEffect(() => {
    (async () => {
      try {
        const users = await pizzaService.getUsers(page, 10, '');
        setUserList(users);
      } catch (e) {
        setUserList([]);
      }
    })();
  }, [page]);


  async function filterUsers() {
    const users = await pizzaService.getUsers(page, 10, `*${filterRef.current?.value}*`);
    setUserList(users);
  }

  function deleteUser(user: User) {
    navigate('/admin-dashboard/delete-user', { state: { user } });
  }

  return (
    <View title="Manage users">
      <div className="text-start py-8 px-4 sm:px-6 lg:px-8">
        <h3 className="text-neutral-100 text-xl">Users</h3>
        <div className="bg-neutral-100 overflow-clip my-4">
          <div className="flex flex-col">
            <div className="-m-1.5 overflow-x-auto">
              <div className="p-1.5 min-w-full inline-block align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="uppercase text-neutral-100 bg-slate-400 border-b-2 border-gray-500">
                      <tr>
                        {['Name', 'Email', 'Roles', 'Action'].map((header) => (
                          <th key={header} scope="col" className="px-6 py-3 text-center text-xs font-medium">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    {userList.map((u, idx) => (
                      <tbody key={idx} className="divide-y divide-gray-200">
                        <tr className="border-neutral-500 border-t-2">
                          <td className="text-start px-2 whitespace-nowrap text-l font-mono text-orange-600">{u.name}</td>
                          <td className="text-start px-2 whitespace-nowrap text-sm font-normal text-gray-800">{u.email}</td>
                          <td className="text-start px-2 whitespace-nowrap text-sm font-normal text-gray-800">
                            {u.roles?.map((r) => r.role).join(', ')}
                          </td>
                          <td className="px-6 py-1 whitespace-nowrap text-end text-sm font-medium">
                            <button type="button" className="px-2 py-1 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-1 border-orange-400 text-orange-400  hover:border-orange-800 hover:text-orange-800" onClick={() => deleteUser(u)}>
                              <TrashIcon />
                              Delete
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    ))}
                    <tfoot>
                      <tr>
                        <td className="px-1 py-1">
                          <input type="text" ref={filterRef} name="filterUsers" placeholder="Filter users" className="px-2 py-1 text-sm border border-gray-300 rounded-lg" />
                          <button type="submit" className="ml-2 px-2 py-1 text-sm font-semibold rounded-lg border border-orange-400 text-orange-400 hover:border-orange-800 hover:text-orange-800" onClick={filterUsers}>
                            Submit
                          </button>
                        </td>
                        <td colSpan={3} className="text-end text-sm font-medium">
                          <button className="w-12 p-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-grey border-grey m-1 hover:bg-orange-200 disabled:bg-neutral-300 " onClick={() => setPage(page - 1)} disabled={page <= 1}>
                            «
                          </button>
                          <button className="w-12 p-1 text-sm font-semibold rounded-lg border border-transparent bg-white text-grey border-grey m-1 hover:bg-orange-200 disabled:bg-neutral-300" onClick={() => setPage(page + 1)} disabled={userList.length < 10}>
                            »
                          </button>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </View>
  );
}
