---
title: Lorekeeper Setup - Part 1 - Configuring Local
description: How to setup Lorekeeper on shared hosting, part 1.
permalink: /posts/lorekeeper-setup-part-1/
date: 2025-08-02
tags: ["lorekeeper", "laravel"]
---

## Introduction
This is a guide on how to setup a copy of Lorekeeper on your local computer. This is a required step before putting Lorekeeper on a live website.

**This first part walks you through setting up your local copy of Lorekeeper. If you have already set up your local, click [here](/posts/lorekeeper-setup-part-2) for part two.**

## Before You Start
- **This guide assumes you are on Windows.** Linux and Mac have alternatives to XAMPP and different methods for SSH. Please reach out to the Lorekeeper Discord if you're on one of those operating systems.
- **Please read every step of this guide carefully.** I highly recommend doing a full read-through before you even get started.

## Installing XAMPP

1. Download [XAMPP](https://www.apachefriends.org/download.html). You want the version that is **PHP 8.2.**

[<img src="/content/img/perabyte-setup/perabyte-setup-xampp.png" alt="download xampp">](/img/perabyte-setup-xampp.png){data-fslightbox="gallery" data-type="image"}

2. Run the XAMPP .exe file. **If you see this warning, as long as you follow this guide, you can ignore it.**

![alt text](/content/img/perabyte-setup/xampp-error.png)

3. Click the "Next" button. You will then see this screen. We just want the defaults -- click "Next" again.

![alt text](/content/img/perabyte-setup/xampp-defaults.png)

4. Install XAMPP directly onto your C: drive. A good location is `C:\xampp`, which should also be the default. Then, click "Next".

![alt text](/content/img/perabyte-setup/xampp-directory.png)

5. Select your preferred language. This doesn't matter -- pick what's best for you.

![alt text](/content/img/perabyte-setup/xampp-language.png)

6. Click "Next" on the following screen. 

![alt text](/content/img/perabyte-setup/xampp-ready-to-install.png)

7. XAMPP should now begin to install. This may take some time -- be patient!

![alt text](/content/img/perabyte-setup/xampp-installing.png)

8. Once XAMPP has installed, check the box to start the control panel immediately (if it is not checked by default).

![alt text](/content/img/perabyte-setup/xampp-finished.png)

9. Congrats! You now have XAMPP installed. Click "Start" next to Apache and MySQL.

![alt text](/content/img/perabyte-setup/xampp-start.png)

**If you are presented with a window like this for either application: Check both "Private" and "Public", then click "Allow Access". This software is perfectly safe.**

![alt text](/content/img/perabyte-setup/uac-error.png)

10. Next, we need to update the config files. Click "Config" next to Apache, and select `php.ini`.

![alt text](/content/img/perabyte-setup/xampp-php-ini.png)

10. A file should open up in Notepad. We are going to change two values. First, use the search feature (Ctrl + F) or simply scroll down until you see `post_max_size`. This controls how large the files are that you can upload. Change this to `0` on your local *only*.

![alt text](/content/img/perabyte-setup/xampp-post-max.png)

11. The next value we change is `upload_max_size`. I like to change this to abnormally high on my local, but make it whatever feels right for you. To change it to 10 megabytes, for example, put a value of `10M`.

![alt text](/content/img/perabyte-setup/xampp-upload-max.png)

12. Close this file and save your changes. We are going to edit one more config file.

13. Go back to XAMPP, click "Config", and select `http.conf`.

![alt text](/content/img/perabyte-setup/xampp-http-conf.png)

14. Another file should open up in Notepad. We are going to change one value this time. Change whatever value is currently in `DocumentRoot` and the following `Directory` line to `C:\xampp\htdocs\lorekeeper\public`.

![alt text](/content/img/perabyte-setup/xampp-document-root.png)

15. Close this file and save your changes. Then, click the "Stop" button next to Apache. After it **fully shuts downs**, click "Start" again.

![alt text](/content/img/perabyte-setup/xampp-stop-start.png)

16. Next, we are going to make one more change in anticipation of installing Lorekeeper. Click the "Admin" button next to MySQL.

![alt text](/content/img/perabyte-setup/mysql-admin.png)

17. This will open a window similar to this in your browser. This is PHPMyAdmin, and it is where we control how most of the data is stored for Lorekeeper. Click "New".

![alt text](/content/img/perabyte-setup/phpmyadmin-start.png)

18. Type in `lorekeeper` or any other easy to remember name, then click "Create".

![alt text](/content/img/perabyte-setup/phpmyadmin-create.png)

19. **Congratulations! We're done here for now.** Next, we will install the Git software needed to manage our Lorekeeper files.

## Installing Git Software

Historically, the software used for managing Git was Sourcetree, but I will be using **Git Extensions** as it is more stable and frequently updated.

### Installing Git

1. First, we need to install Git itself. Git is a tool used to manage files and file history for coding projects. Go [here](https://git-scm.com/downloads) to download the latest copy of Git.

Click this button...
![alt text](/content/img/perabyte-setup/git-dl-1.png)

..and then this link.
![alt text](/content/img/perabyte-setup/git-dl-2.png)

2. After the file is done downloading, run it. You will see this screen. Press "Next".

![alt text](/content/img/perabyte-setup/git-install.png)

3. **Make sure the highlighted fields are selected.** Press "Next".

![alt text](/content/img/perabyte-setup/git-install-1.png)

4. This next option is up to you. I personally use Notepad++, but if you're brand new, select **Notepad**.

![alt text](/content/img/perabyte-setup/git-install-2.png)

5. This next option should populate by default, but for maximum compatibility with Lorekeeper, you will want to make sure you check "Override" and type in `main`.

![alt text](/content/img/perabyte-setup/git-install-3.png)

6. You will then see this screen. Select the middle/"recommended" option.

![alt text](/content/img/perabyte-setup/git-install-4.png)

7. The default (OpenSSH) on this screen is fine.

![alt text](/content/img/perabyte-setup/git-install-5.png)

8. This default is also fine.

![alt text](/content/img/perabyte-setup/git-install-6.png)

9. Select the default here as well.

![alt text](/content/img/perabyte-setup/git-install-7.png)

10. You know the drill -- select the default!

![alt text](/content/img/perabyte-setup/git-install-8.png)

11. **This one is important. Select "fast-forward or merge".**

![alt text](/content/img/perabyte-setup/git-install-9.png)

12. The default is good here as well.

![alt text](/content/img/perabyte-setup/git-install-10.png)

13. Check both these options.

![alt text](/content/img/perabyte-setup/git-install-11.png)

14. You may be prompted with this screen. If so, **close all other windows on your computer** and then click "Install".

![alt text](/content/img/perabyte-setup/git-install-12.png)

15. Git will then begin to install. Be patient while it completes!

![alt text](/content/img/perabyte-setup/git-install-13.png)

16. Congratulations! Git is now installed. Check "finish".

![alt text](/content/img/perabyte-setup/git-install-14.png)

17. **Reboot your entire computer.** Certain things we installed with Git will only take effect _after_ our computer has restarted. So do that, and then come back!

### Installing Git Extensions

You can use Git purely from the command line, but it's not reccomended for beginners. To make things easier, we will be using a tool called **Git Extensions**.

1. Go [here](https://gitextensions.github.io) and click "Download". 

![alt text](/content/img/perabyte-setup/git-extensions-dl.png)

2. Scroll down and download the `.msi` file.

![alt text](/content/img/perabyte-setup/git-extensions-dl-1.png)

3. Run this file. You should be prompted with a window like this. Click "Next".

![alt text](/content/img/perabyte-setup/git-extensions-1.png)

4. You will be presented with two options. Select "Install for all users of this machine".

![alt text](/content/img/perabyte-setup/git-extensions-2.png)

5. Then, you will be asked for the installation directory. The default is perfectly acceptable.

![alt text](/content/img/perabyte-setup/git-extensions-3.png)

6. Click "Next" on this screen. We don't need to change any of the options.

![alt text](/content/img/perabyte-setup/git-extensions-4.png)

7. Git Extensions will then begin installing. After it's done, you'll be sent to this screen. Click "Finish".

![alt text](/content/img/perabyte-setup/git-extensions-5.png)

8. When starting Git Extensions, you may see this message. That's OK! We just need to install one more file. 

![alt text](/content/img/perabyte-setup/GitExtensions_p3zdwm14Fi.png)

Click the button. It should open a webpage and automatic start the download of the .NET runtime. Run this file, and install it. It's a fairly straightforward install -- you shouldn't be presented with any funky options.

![alt text](/content/img/perabyte-setup/net-runtime.png)

9. Start Git Extensions again. You should be presented with the option to pick your language. I will be selecting English.

![alt text](/content/img/perabyte-setup/git-extensions-language.png)

10. Git Extensions will present you with this "checklist" window every time you start the software. **Not everything needs to be completed for it to run properly -- we will go through the essentials.**

![alt text](/content/img/perabyte-setup/git-extensions-checklist.png)

11. Most options should be automatically marked as green. Please make a thread in the Lorekeeper discord if any of the options are not automatically detected. The option we are most concerned about is the second (configuring a username/email), which may or may not be green for you. Click that option.

![alt text](/content/img/perabyte-setup/git-extensions-checklist-1.png)

12. **Make sure the highlighted values are something you are OK with being seen by the public.** They are mandatory fields. All others can be left blank. Fill them in how you'd like, then select **Apply** then **OK**.

![alt text](/content/img/perabyte-setup/git-extensions-checklist-2.png)

13. A window like this should then open. **Congratulations! Git Extensions is now installed.**

![alt text](/content/img/perabyte-setup/git-extensions-installed.png)

## Copying Lorekeeper

Now we start to get to the fun stuff! We are now going to use Git Extensions to make a copy of Lorekeeper. This will be your personalized version that is posted to your live website.

1. In Git Extensions, select "Clone a Repository." "Clone" is the Git term for making a copy of the code.
(Ignore the button that says to specifically clone a GitHub Repository. That option is for advanced users who have GitHub accounts.) 

![alt text](/content/img/perabyte-setup/clone-repo.png)

2. Now we will fill out this field with some information that tells Git Extensions where the Lorekeeper code is located. On the browser, it can be access [here](https://github.com/lk-arpg/lorekeeper), but we use a slightly different URL address when pasting it into Git.

3. Paste `https://github.com/lk-arpg/lorekeeper.git` into the first text box labeled **Repository to clone**. Some data will begin to populate automatically -- that's good!

![alt text](/content/img/perabyte-setup/clone-repo-1.png)

4. Next, click "Browse". We are going to navigate to a specific directory within our installation of XAMPP. If you installed XAMPP in the directory `C:/xampp/`, we will be selecting the folder `C:/xampp/htdocs`.

![alt text](/content/img/perabyte-setup/clone-repo-2.png)

5. After clicking "Select Folder", your window should look like this.

![alt text](/content/img/perabyte-setup/clone-repo-3.png)

6. Click the dropdown next to "Branch" and select `main`. You also have to option to directly select the 3.0.0 version, but this can make things slightly more complicated later on. We will instead download LK v2 (aka `main`) and then update it to match v3.

![alt text](/content/img/perabyte-setup/clone-repo-4.png)

7. After that's selected, leave everything else as default. You can then click "Clone".

![alt text](/content/img/perabyte-setup/clone-repo-5.png)

8. A window like this will show up. Let it do its thing, then click "OK" when prompted.

![alt text](/content/img/perabyte-setup/clone-repo-6.png)

9. Click "Yes" to open the new repository now.

![alt text](/content/img/perabyte-setup/clone-repo-7.png)

10. It will open a screen like this. There's a lot of buttons here, but don't fret! We won't need most of them.

![alt text](/content/img/perabyte-setup/update-v3.png)

11. First, let's make sure we're updated to v3.0.0. On the left panel you'll see a dropdown labeled `origin`. Click that to create a further dropdown, then click `release`. You will see a branch labeled v3.0.0. A "branch" refers to a specific version of the code.

![alt text](/content/img/perabyte-setup/update-v3-1.png)

12. Right-click 'v3.0.0' and select "Fetch & Merge (Pull)".

![alt text](/content/img/perabyte-setup/update-v3-2.png)

13. You will see a similar window to before -- get used to it, this is what will be displayed every time you perform a git operation! Press "OK" when prompted.

![alt text](/content/img/perabyte-setup/update-v3-3.png)

14. This window will then appear. Leave everything as default, and select "Merge".

![alt text](/content/img/perabyte-setup/update-v3-4.png)

15. Press "OK" after this window finishes processing.

![alt text](/content/img/perabyte-setup/update-v3-5.png)

16. That's it! You now have a copy of Lorekeeper on your computer, updated to v3.0.0.

## Setting Up Lorekeeper

Back to installing stuff. There's a few things we need before we can full get our copy of Lorekeeper up and running.

### Installing Composer

1. We need to install two more pieces of software. First, we will install Composer. Go [here](https://getcomposer.org) and select "Download" beneath the image of this funky little dude.

![alt text](/content/img/perabyte-setup/composer-1.png)

2. Click the link for the Windows Installer, then run it.

![alt text](/content/img/perabyte-setup/composer-2.png)

3. Click to install for all users.

![alt text](/content/img/perabyte-setup/composer-3.png)

4. Leave developer mode **unchecked**. Click "Next".

![alt text](/content/img/perabyte-setup/composer-4.png)

5. XAMPP should be automatically selected as your command line version of PHP. If not, use the dropdown to select it. If prompted, also select the checkmark to add it to your path.

![alt text](/content/img/perabyte-setup/composer-5.png)

6. Click "Next" on this screen.

![alt text](/content/img/perabyte-setup/composer-6.png)

7. You will see a screen similar to this one, summarizing your options. Click "Install".

![alt text](/content/img/perabyte-setup/composer-7.png)

8. On this screen, click "Next".

![alt text](/content/img/perabyte-setup/composer-8.png)

9. Then, click "Finish"!

![alt text](/content/img/perabyte-setup/composer-9.png)

10. **Reboot your computer.** While Composer mentions that it won't always be necessary, rebooting our computer after installing Composer is the best way to prevent issues.

### Installing Visual Studio Code

Visual Studio Code is the piece of software we will use to edit our Lorekeeper files. (Pardon the sparse screenshots here, I already had it installed!)

**A Note for Advanced Users:** You can install the VSCodium open source version, which comes with AI/Copilot features disabled by default, [here](https://github.com/VSCodium/vscodium/releases). However, you may run into issues with using certain extensions due to Microsoft's licensing. When in doubt, it is better to go with the Microsoft official release.

1. Go [here](https://code.visualstudio.com) to download it and press the big download button. (Fortunately, we can disable the recently added AI features.)

![alt text](/content/img/perabyte-setup/vscode-1.png)

2. You will be presented with the license agreement. Check the agree button, then click "Next".

3. Check all the boxes (with desktop icon checked depending on your preference) and click "Next".

![alt text](/content/img/perabyte-setup/VSCodeUserSetup-x64-1.102.3.tmp_kvdkB3aTvY.png)

4. Click "Install".

5. It will then install. Check the button to launch it, then click the "Finish" button when complete.

![alt text](/content/img/perabyte-setup/VSCodeUserSetup-x64-1.102.3.tmp_YGV489RIgS.png)

6. **If you wish to disable the AI features** aka "Copilot", go to the top bar and type in `>copilot disable`. You should be presented with options like this. Click "Disable Completions". This should disable any of the in-your-face AI options.

![alt text](/content/img/perabyte-setup/disable-copilot.png)

## Running Lorekeeper

We can _finally_ get to actually running Lorekeeper! 

1. Open up the File Explorer and navigate to where Lorekeeper is installed on your computer. The easiest way to do this is via Git Extensions. Click "Repository" and then "File Explorer" in the top navigation.

![alt text](/content/img/perabyte-setup/running-lk-1.png)

2. Right click anywhere in the empty space (make sure you don't have a file/directory selected!) and click "Open With Code".

![alt text](/content/img/perabyte-setup/running-lk-2.png)

3. Behold! All of the files that make up your Lorekeeper. However, we need to install a few files before it will work properly. In the top bar, click "Terminal" and then "New Terminal".

![alt text](/content/img/perabyte-setup/running-lk-3.png)

4. Type in `composer install`. A lot of text will go flying by as composer installs the various chunks of code required for LK to run.

![alt text](/content/img/perabyte-setup/running-lk-4.png)

**It may get stuck for a while on `Generating optimized autoload files`. Be patient! It will finish eventually.**

![alt text](/content/img/perabyte-setup/running-lk-5.png)

It should look like this when done:

![alt text](/content/img/perabyte-setup/running-lk-6.png)

5. Next, we will create the .env file, which will define some variables that Lorekeeper needs to run. Right-click near the bottom of the file list and click "New File". Name this file `.env`.

![alt text](/content/img/perabyte-setup/running-lk-7.png)

6. The file should open by default (if not, double click it to open it). You will see a screen like this:

![alt text](/content/img/perabyte-setup/running-lk-8.png)

8. **We're going to paste a lot of text here!** Here is the contents to paste into this file:

```
APP_NAME=Lorekeeper
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

CONTACT_ADDRESS=
DEVIANTART_ACCOUNT=
 
LOG_CHANNEL=stack
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=lorekeeper
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_DRIVER=log
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

BROADCAST_DRIVER=log
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_DRIVER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=

PUSHER_APP_ID=
PUSHER_APP_KEY=
PUSHER_APP_SECRET=
PUSHER_APP_CLUSTER=mt1

MIX_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
MIX_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

9. Save the file. Now, go back to the terminal. We are going to run a few setup commands. Type in `php artisan key:generate`. You will see something like this:

![alt text](/content/img/perabyte-setup/running-lk-9.png)

10. Next, type in `php artisan migrate`. This will populate the database with all of the tables that Lorekeeper needs to function. You'll see a LOT of text start to fly by. It should look like this when completed:

![alt text](/content/img/perabyte-setup/running-lk-10.png)

11. Now for some Lorekeeper-specific commands. Run `php artisan add-site-settings` to populate the database with the site settings. It should look like this when completed:

![alt text](/content/img/perabyte-setup/running-lk-12.png)

12. Then run `php artisan add-text-pages`. This will add the default text pages for LK:

![alt text](/content/img/perabyte-setup/running-lk-11.png)

13. Next run `php artisan copy-default-images`. This will add the default images for various features on LK:

![alt text](/content/img/perabyte-setup/running-lk-12.png)

14. Finally, we will run the command `php artisan setup-admin-user`. This will create user #1, the default admin account. The email and details you give it do not need to be real, but make them something you'll remember easily.

The important details to mark as `yes` have been highlighted in red.
- `Proceed to create account with this information? (yes/no)`
- `Are you on a local/testing instance and not a live site? (yes/no)`
- `Would you like to mark your email address as verified and enter an alias now? (yes/no)`

![alt text](/content/img/perabyte-setup/running-lk-13.png)

15. Now, go to `http://localhost` in your browser. You can also access this by pressing the "Admin" button next to "Apache" in XAMPP.

![alt text](/content/img/perabyte-setup/running-lk-15.png)

**Congratulations!** You have finished installing a local copy of Lorekeeper. You can login as the admin account you just set up, and begin trying out the different features.

![alt text](/content/img/perabyte-setup/running-lk-14.png)

When you are ready, you can set up a live version of the site with [part two](/posts/lorekeeper-setup-part-2).