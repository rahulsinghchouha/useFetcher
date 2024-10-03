import { useFetcher, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";

export async function loader() {
  const users = await prisma.user.findMany(); // Fetch users from MongoDB
  return { users };
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const age = parseInt(formData.get("age") as string, 10);
  const status = formData.get("status") as string;

  await prisma.user.create({
    data: {
      name,
      age,
      status,
    },
  });

  return null;
}
type User = {
  id: string;
  name: string;
  age: number;
  status: string;
};

export default function Index() {
  const fetcher = useFetcher();
//  const { users } = useLoaderData();
  const { users } = useLoaderData<{ users: User[] }>();
  return (
    <div>
      <h1>Submit User Data</h1>
      <fetcher.Form method="post">
        <div>
          <label>
            Name: <input type="text" name="name" required />
          </label>
        </div>
        <div>
          <label>
            Age: <input type="number" name="age" required />
          </label>
        </div>
        <div>
          <label>
            Status:
            <select name="status" required>
              <option value="fresher">Fresher</option>
              <option value="experienced">Experienced</option>
            </select>
          </label>
        </div>
        <button type="submit">Submit</button>
      </fetcher.Form>

      <h2>Submitted Users:</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name}, {user.age}, {user.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
