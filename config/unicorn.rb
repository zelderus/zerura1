wd = '/home/zelder/rails/zerura/'

worker_processes 2
working_directory wd

preload_app true

timeout 30

listen "#{wd}tmp/sockets/unicorn.sock", :backlog => 64

pid "#{wd}tmp/pids/unicorn.pid"

stderr_path "#{wd}log/unicorn.stderr.log"
stdout_path "#{wd}log/unicorn.stdout.log"

before_fork do |server, worker|
    defined?(ActiveRecord::Base) and
        ActiveRecord::Base.connection.disconnect!
end

after_fork do |server, worker|
    defined?(ActiveRecord::Base) and
        ActiveRecord::Base.establish_connection
end
