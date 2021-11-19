# MPS Embed

An [oEmbed](http://oembed.com/) provider for embedding resources from the Harvard University Library. Based on Stanford's [SUL-Embed](https://github.com/sul-dlss/sul-embed)


## Docker Instructions

### 1: Create app environment variables

##### Create config file for environment variables
- Make a copy of the config example file `./env-example.txt`
- Rename the file to `.env`
- Replace placeholder values as necessary

*Note: The config file .env is specifically excluded in .gitignore and .dockerignore, since it contains credentials it should NOT ever be committed to any repository.*

### 2: Create webapp config
- Make a copy of the config example file `./webapp.conf.template`
- Rename the file to `webapp.conf`
- Replace placeholder values as necessary

*Note: The config file webapp.conf is specifically excluded in .gitignore and .dockerignore, since it contains local customizations it should NOT ever be committed to any repository.*

### 3: Start

This command builds all images and runs all containers specified in the docker-compose-local.yml configuration.

A local version of the docker compose file `docker-compose-local.yml` should be used for local development. The name of the local compose file must be specified in the command with the -f option. This local docker compose file points to a local version of the dockerfile `DockerfileLocal`, which is specified in the services > geoblacklight_web > build > dockerfile property.

This command uses the `docker-compose-local.yml` file to build the `DockerfileLocal` image `--build` and also starts the containers `up` in background mode `-d`.

```
docker-compose -f docker-compose-local.yml up -d --build --force-recreate
```

To restart the containers later without a full rebuild, the options `--build` and `--force-recreate` can be omitted after the images are built already.

### 4: Run commands inside a container
To run commands inside a running container, execute a shell using the `exec` command. This same technique can be used to run commands in any container that is running already.

```
docker exec -it mps-embed-web bash
```

Once inside the geoblacklight_web container, Rails commands can be run such as migrations.

```
rake db:migrate
```

Alternatively, to run commands inside a container that is not running already, use the docker run command or the docker compose run command.

### 5: Stop

##### STOP AND REMOVE

This command stops and removes all containers specified in the docker-compose-local.yml configuration. This command can be used in place of the 'stop' and 'rm' commands.

```
docker-compose -f docker-compose-local.yml down
```

## Development/Test Sandbox

There is an embedded static page available at `/pages/sandbox` in your development and test environments. Make sure that you use the same host on the service input (first text field) as you are accessing the site from (e.g. localhost or 127.0.0.1).

You'll also want to configure the `Settings.embed_iframe_url` to be the same host/port as you are accessing the site from to ensure that the iframe being embedded is pointing locally and not remotely (as is the default).

## oEmbed specification details

URL scheme: `http://purl.stanford.edu/*`

API endpoint: `TBD`

Example: `TBD?url=http://purl.stanford.edu/zw200wd8767&format=json`

## Installing JavaScript dependencies using Yarn

MPS Embed is starting to manage its JavaScript dependencies using [Yarn](https://yarnpkg.com/en/docs/install).

To install needed JavaScript dependencies make sure to install them using:

```sh
$ yarn install
```

## Creating Viewers

You can create a viewer by implementing a class with a pretty simple API.

The viewer class will be instantiated with an Embed::Request object. The `initialize` method is included in the `CommonViewer` parent class but can be overridden.

    module Embed
      class Viewer
        class DemoViewer < CommonViewer
        end
      end
    end


The class must define a class method returning an array of which types it will support.  These types are derived from the type attribute from the contentMetadata.

    module Embed
      class Viewer
        class DemoViewer < CommonViewer

          def self.supported_types
            [:demo_type]
          end
        end
      end
    end


The file that the class is defined in (or your preferred method) should register itself as a view with the Embed module.

    module Embed
      class Viewer
        class DemoViewer < CommonViewer
          def self.supported_types
            [:demo_type]
          end
        end
      end
    end

    Embed.register_viewer(Embed::Viewer::DemoViewer) if Embed.respond_to?(:register_viewer)


### Linking in viewers

The rich HTML payload that is supplied via the oEmbed API is an iframe. This means that all consumers will be embedding an iframe into their page. Given this fact, generating links will require explicit targets if they are not intended to internally replace embed content.  Given this, there are two patterns that can be used.  For links intended to download files, a `target="_blank"` can be used (effectively opening a new tab for the download which is immediately closed).  When using `target="_blank"` add `rel="noopener noreferrer"` **particularly** when linking externally (although this should be reserved for linking to internal resources when possible). See [this blog post](https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/) for an explanation. *Note: This does not apply to WebAuth links.*

For links that are intended to navigate the users browser away from the current page (e.g. the links to Memento/GeoBlacklight/etc.) then `target="_parent"` should be used to give the link the default browser behavior. [More about link targets](http://www.w3schools.com/tags/att_a_target.asp).

### Console Example

    $ viewer = Embed.registered_viewers.first
    => Embed::DemoViewer
    $ request = Embed::Request.new({url: 'http://purl.stanford.edu/bb112fp0199'})
    => #<Embed::Request>
    $ viewer.new(request)
    => # your viewer instance

### Customizing the Embed Panel

Viewers can customize the embed panel.  To do this, create a template in `app/views/embed/embed-this`, to provide the HTML for the embed panel.

See File viewers for an example.


### Adding a Download Panel
Viewers can add their own download panel.  To do this, create a template in `app/views/embed/download`, to provide the HTML for the download panel.

In order to enable the download panel you need to provide a method in your viewer class.  This method lets the footer logic know that the viewer will provide a download panel and it should render the Download button.

    def show_download?
      true
    end
